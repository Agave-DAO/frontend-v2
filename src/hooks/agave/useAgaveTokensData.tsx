import { useCallback, useMemo } from 'react'

import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import useSWR from 'swr'

import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useRewardTokenData } from '@/src/hooks/symmetrics/useRewardTokenData'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import {
  getIncentiveRate as calculateIncentiveRate,
  getMarketSize,
  getPriceShares,
} from '@/src/utils/markets'
import { ChainsValues } from '@/types/chains'
import {
  AaveOracle__factory,
  AaveProtocolDataProvider__factory,
  BaseIncentivesController__factory,
} from '@/types/generated/typechain'
import { Token } from '@/types/token'
import { isFulfilled } from '@/types/utils'

/**
 * TYPES
 */
export type IncentiveData = {
  agToken: [BigNumber, BigNumber, BigNumber]
  variableDebt: [BigNumber, BigNumber, BigNumber]
}

export type AgaveTokenData = {
  tokenAddress: string
  priceData: BigNumber
  reserveData: {
    totalStableDebt: BigNumber
    totalVariableDebt: BigNumber
    liquidityRate: BigNumber
    variableBorrowRate: BigNumber
    stableBorrowRate: BigNumber
    availableLiquidity: BigNumber
  }
  assetData: { isActive: boolean; isFrozen: boolean }
  incentiveData: IncentiveData
}

export type AgaveTokensData = {
  [underlyingTokenAddress: string]: AgaveTokenData
}

/**
 * FETCHERS
 */
const fetchTokenPrice = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  const contract = AaveOracle__factory.connect(contracts.AgaveOracle.address[chainId], provider)
  return { priceData: await contract.getAssetPrice(tokenAddress), tokenAddress }
}

const fetchReserveData = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  return {
    reserveData: await AaveProtocolDataProvider__factory.connect(
      contracts.AaveProtocolDataProvider.address[chainId],
      provider,
    ).getReserveData(tokenAddress),
    tokenAddress,
  }
}

const fetchAssetConfigurationData = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  return {
    assetData: await AaveProtocolDataProvider__factory.connect(
      contracts.AaveProtocolDataProvider.address[chainId],
      provider,
    ).getReserveConfigurationData(tokenAddress),
    tokenAddress,
  }
}

const fetchAssetIncentiveData = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  const relatedTokens = agaveTokens.getRelatedTokensByAddress(tokenAddress)
  const agToken = relatedTokens.find(({ type }) => type === 'ag')
  const variableDebtToken = relatedTokens.find(({ type }) => type === 'variableDebt')
  if (!agToken || !variableDebtToken) {
    throw Error('Error on getting agToken/variableDebtToken')
  }
  const contract = BaseIncentivesController__factory.connect(
    contracts.IncentiveBaseController.address[chainId],
    provider,
  )
  return {
    incentiveData: {
      // TODO should stableDebtToken has incentiveData?
      agToken: await contract.getAssetData(agToken.address),
      variableDebt: await contract.getAssetData(variableDebtToken.address),
    },
    tokenAddress,
  }
}

/**
 * Takes an array of token addresses, and returns an object with the token addresses as keys, and
 * the token data as values
 * @returns An object with the token address as the key and the value is an object with the token
 * address, priceData, reserveData, incentiveData and assetData.
 */
const fetchAgaveTokensData = async ({
  chainId,
  provider,
  underlyingTokenAddresses,
}: {
  chainId: ChainsValues
  provider: JsonRpcBatchProvider
  underlyingTokenAddresses: string[]
}) => {
  const pricesDataPromises: ReturnType<typeof fetchTokenPrice>[] = []
  const reserveDataPromises: ReturnType<typeof fetchReserveData>[] = []
  const assetDataPromises: ReturnType<typeof fetchAssetConfigurationData>[] = []
  const incentiveDataPromises: ReturnType<typeof fetchAssetIncentiveData>[] = []

  underlyingTokenAddresses.forEach(async (tokenAddress) => {
    pricesDataPromises.push(fetchTokenPrice(tokenAddress, provider, chainId))
    reserveDataPromises.push(fetchReserveData(tokenAddress, provider, chainId))
    assetDataPromises.push(fetchAssetConfigurationData(tokenAddress, provider, chainId))
    incentiveDataPromises.push(fetchAssetIncentiveData(tokenAddress, provider, chainId))
  })

  const combinedPromisesResolved = await Promise.allSettled([
    ...pricesDataPromises,
    ...reserveDataPromises,
    ...assetDataPromises,
    ...incentiveDataPromises,
  ])

  // TODO catch errors here
  const rawResults = combinedPromisesResolved.filter(isFulfilled).map(({ value }) => value)

  /* Merge the results of the promises. */
  let results: AgaveTokensData = {}
  for (let index = 0; index < rawResults.length; index++) {
    const current = rawResults[index]
    const isInResult = results?.[current.tokenAddress]
    results = { ...results, [current.tokenAddress]: { ...current, ...isInResult } }
  }

  return results
}

// WARNING: batch provider accepts a maximum of 100 calls. Each token has 6 queries to get data.
// 1 token = 4 queries, 2 tokens = 8 queries, 8 tokens = 32 queries
// We must be careful if there are more than ~25 tokens in the array
// In that case, we can split the tokens array into small arrays of tokens (such as pagination)

const useTokensDataQuery = (underlyingTokenAddresses: string[]) => {
  const { appChainId, batchProvider } = useWeb3Connection()
  // Simple cacheKey to get the cache data in other uses.
  const { data } = useSWR(
    underlyingTokenAddresses?.length ? `agave-tokens-data` : null,
    () => {
      if (!underlyingTokenAddresses?.length) {
        return
      }
      const fetcherParams = {
        underlyingTokenAddresses,
        provider: batchProvider,
        chainId: appChainId,
      }
      return fetchAgaveTokensData(fetcherParams)
    },
    {
      refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
    },
  )

  return data
}

/**
 * Returns tokensData query result and a bunch of functions that are used to get data about the tokens
 * @param {Token[]} tokens - Token[]
 * @param {boolean} [showDisabledTokens] - boolean
 */
export const useAgaveTokensData = (tokens: Token[], showDisabledTokens?: boolean) => {
  const underlyingTokenAddresses = tokens.map(({ address }) => address)
  const data = useTokensDataQuery(underlyingTokenAddresses)
  const rewardTokenData = useRewardTokenData()?.pools[0]

  const agaveTokensData = useMemo(() => {
    if (!data) {
      return
    }

    if (showDisabledTokens) {
      return data
    }

    /* Filtering out the tokens that are frozen. */
    const filteredDisabledTokens = Object.entries(data).filter(
      ([, { assetData }]) => !assetData.isFrozen,
    )

    return Object.fromEntries(filteredDisabledTokens)
  }, [data, showDisabledTokens])

  /* Returns the market size of a token. */
  const getTokenMarketSize = useCallback(
    (tokenAddress: string) => {
      const tokenData = agaveTokensData?.[tokenAddress]
      if (!tokenData) {
        return ZERO_BN
      }
      const { availableLiquidity, totalVariableDebt } = tokenData.reserveData

      return getMarketSize({
        tokenAddress,
        totalSupply: totalVariableDebt.add(availableLiquidity),
        price: tokenData.priceData,
      })
    },
    [agaveTokensData],
  )

  /* Returns the total market size of all the tokens. */
  const getTotalMarketSize = useCallback(() => {
    if (!agaveTokensData) {
      return ZERO_BN
    }
    return Object.values(agaveTokensData).reduce(
      (total, current) => total.add(getTokenMarketSize(current.tokenAddress)),
      ZERO_BN,
    )
  }, [agaveTokensData, getTokenMarketSize])

  const getTokenTotalBorrowed = useCallback(
    (tokenAddress: string) => {
      const tokenData = agaveTokensData?.[tokenAddress]
      if (!tokenData) {
        return ZERO_BN
      }
      const { totalStableDebt, totalVariableDebt } = tokenData.reserveData
      return totalStableDebt.add(totalVariableDebt)
    },
    [agaveTokensData],
  )

  const getDepositAPY = useCallback(
    (tokenAddress: string) => {
      const tokenData = agaveTokensData?.[tokenAddress]
      if (!tokenData) {
        return ZERO_BN
      }
      return tokenData.reserveData.liquidityRate
    },
    [agaveTokensData],
  )

  const getBorrowRate = useCallback(
    (tokenAddress: string) => {
      const tokenData = agaveTokensData?.[tokenAddress]
      if (!tokenData) {
        return {
          stable: ZERO_BN,
          variable: ZERO_BN,
        }
      }
      return {
        stable: tokenData.reserveData.stableBorrowRate,
        variable: tokenData.reserveData.variableBorrowRate,
      }
    },
    [agaveTokensData],
  )

  const getIncentiveRate = useCallback(
    (tokenAddress: string, deposit: boolean) => {
      const tokenData = agaveTokensData?.[tokenAddress]
      if (!tokenData || !rewardTokenData) {
        return ZERO_BN
      }

      const {
        incentiveData,
        priceData: tokenPrice,
        reserveData: { availableLiquidity, totalVariableDebt },
      } = tokenData

      return calculateIncentiveRate({
        emissionPerSeconds: deposit ? incentiveData.agToken[1] : incentiveData.variableDebt[1],
        tokenSupply: deposit ? totalVariableDebt.add(availableLiquidity) : totalVariableDebt,
        priceShares: getPriceShares(rewardTokenData),
        tokenAddress,
        tokenPrice,
      })
    },
    [agaveTokensData, rewardTokenData],
  )

  return {
    agaveTokensData,
    getIncentiveRate,
    getTokenMarketSize,
    getTotalMarketSize,
    getTokenTotalBorrowed,
    getDepositAPY,
    getBorrowRate,
  }
}

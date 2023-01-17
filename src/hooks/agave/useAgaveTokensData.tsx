import { useCallback } from 'react'

import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import useSWR from 'swr'

import { AgaveProtocolTokenType, agaveTokens } from '@/src/config/agaveTokens'
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
  agTokenEmissionPerSeconds: BigNumber
  variableDebtEmissionPerSeconds: BigNumber
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

  const agTokenIncentiveData = await contract.getAssetData(agToken.address)
  const variableDebtIncentiveData = await contract.getAssetData(agToken.address)

  return {
    incentiveData: {
      // TODO should stableDebtToken has incentiveData?
      agTokenEmissionPerSeconds: agTokenIncentiveData[1],
      variableDebtEmissionPerSeconds: variableDebtIncentiveData[1],
    },
    tokenAddress,
  }
}

/**
 * Takes an array of token addresses, and returns an object with AgaveTokenData for each token
 */
const fetchAgaveTokensData = async ({
  chainId,
  provider,
  reserveTokensAddresses,
}: {
  chainId: ChainsValues
  provider: JsonRpcBatchProvider
  reserveTokensAddresses: string[]
}) => {
  const pricesDataPromises: ReturnType<typeof fetchTokenPrice>[] = []
  const reserveDataPromises: ReturnType<typeof fetchReserveData>[] = []
  const assetDataPromises: ReturnType<typeof fetchAssetConfigurationData>[] = []
  const incentiveDataPromises: ReturnType<typeof fetchAssetIncentiveData>[] = []

  reserveTokensAddresses.forEach(async (tokenAddress) => {
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

  const rawResults = combinedPromisesResolved.filter(isFulfilled).map(({ value }) => value)

  /* Merge the results of the promises by reserve token address. */
  const tokensData = reserveTokensAddresses.map((reserveAddress) => {
    // Find all occurrences by reserveAddress
    const rawDataByReserveToken = rawResults.filter(
      ({ tokenAddress }) => reserveAddress === tokenAddress,
    )

    let tokenData: AgaveTokenData = {} as AgaveTokenData

    rawDataByReserveToken.forEach((item) => {
      tokenData = { ...tokenData, ...item }
    })

    return tokenData
  })

  return tokensData
}

// WARNING: batch provider accepts a maximum of 100 calls. Each token has 4 queries to get data.
// 1 token = 4 queries, 2 tokens = 8 queries, 8 tokens = 32 queries
// We must be careful if there are more than ~25 tokens in the array
// In that case, we can split the tokens array into small arrays of tokens (such as pagination)
const useTokensDataQuery = (reserveTokensAddresses: string[]) => {
  const { appChainId, batchProvider } = useWeb3Connection()
  // Simple cacheKey to get the cache data in other uses.
  const { data } = useSWR(
    reserveTokensAddresses?.length ? `agave-tokens-data` : null,
    () => {
      if (!reserveTokensAddresses?.length) {
        return
      }
      const fetcherParams = {
        reserveTokensAddresses,
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
 * Returns marketsData query result and a bunch of functions that are used to get data about the tokens
 * @param {string[]} string - string[]
 */
export const useAgaveTokensData = (reserveTokensAddresses: string[]) => {
  const agaveTokensData = useTokensDataQuery(reserveTokensAddresses)
  const rewardTokenData = useRewardTokenData()?.pools[0]

  const findToken = useCallback(
    (address: string) => {
      return agaveTokensData?.find((tokenData) => tokenData.tokenAddress === address)
    },
    [agaveTokensData],
  )

  /* Returns the market size of a token. */
  const getTokenMarketSize = useCallback(
    (tokenAddress: string) => {
      const tokenData = findToken(tokenAddress)
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
    [findToken],
  )

  const getTokenTotalBorrowed = useCallback(
    (tokenAddress: string) => {
      const tokenData = findToken(tokenAddress)
      if (!tokenData) {
        return ZERO_BN
      }
      const { totalStableDebt, totalVariableDebt } = tokenData.reserveData
      return totalStableDebt.add(totalVariableDebt)
    },
    [findToken],
  )

  const getDepositAPY = useCallback(
    (tokenAddress: string) => {
      const tokenData = findToken(tokenAddress)
      if (!tokenData) {
        return ZERO_BN
      }
      return tokenData.reserveData.liquidityRate
    },
    [findToken],
  )

  const getBorrowRate = useCallback(
    (tokenAddress: string) => {
      const tokenData = findToken(tokenAddress)
      if (!tokenData) {
        return {
          stable: ZERO_BN,
          variable: ZERO_BN,
        }
      }
      const { stableBorrowRate, variableBorrowRate } = tokenData.reserveData
      return {
        stable: stableBorrowRate,
        variable: variableBorrowRate,
      }
    },
    [findToken],
  )

  const getIncentiveRate = useCallback(
    (tokenAddress: string, tokenType: AgaveProtocolTokenType) => {
      const tokenData = findToken(tokenAddress)
      if (!tokenData || !rewardTokenData) {
        return ZERO_BN
      }

      const {
        incentiveData,
        priceData: tokenPrice,
        reserveData: { availableLiquidity, totalVariableDebt },
      } = tokenData

      const emissionPerSeconds =
        tokenType === 'ag'
          ? incentiveData.agTokenEmissionPerSeconds
          : tokenType === 'variableDebt'
          ? incentiveData.variableDebtEmissionPerSeconds
          : ZERO_BN

      const tokenSupply =
        tokenType === 'ag'
          ? totalVariableDebt.add(availableLiquidity)
          : tokenType === 'variableDebt'
          ? totalVariableDebt
          : ZERO_BN

      return calculateIncentiveRate({
        emissionPerSeconds,
        tokenSupply,
        priceShares: getPriceShares(rewardTokenData),
        tokenAddress,
        tokenPrice,
      })
    },
    [findToken, rewardTokenData],
  )

  return {
    agaveTokensData,
    getIncentiveRate,
    getTokenMarketSize,
    getTokenTotalBorrowed,
    getDepositAPY,
    getBorrowRate,
  }
}

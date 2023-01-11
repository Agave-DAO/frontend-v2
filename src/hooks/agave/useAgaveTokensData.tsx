import { useCallback } from 'react'

import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import useSWR from 'swr'

import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getMarketSize } from '@/src/utils/markets'
import { ChainsValues } from '@/types/chains'
import {
  AaveOracle__factory,
  AaveProtocolDataProvider__factory,
  ERC20__factory,
} from '@/types/generated/typechain'
import { Token } from '@/types/token'
import { isFulfilled } from '@/types/utils'

/**
 * TYPES
 */
export type AgaveTokenData = {
  tokenAddress: string
  price: BigNumber
  agTokenTotalSupply: BigNumber
  reserveData: {
    totalStableDebt: BigNumber
    totalVariableDebt: BigNumber
    liquidityRate: BigNumber
    variableBorrowRate: BigNumber
    stableBorrowRate: BigNumber
  }
  assetData: { isActive: boolean; isFrozen: boolean }
}

export type AgaveTokensData = {
  [underlyingTokenAddress: string]: AgaveTokenData
}

export type TokenPriceResult = { price: BigNumber; tokenAddress: string }
export type AgTokenTotalSupplyResult = { agTokenTotalSupply: BigNumber; tokenAddress: string }

/**
 * FETCHERS
 */
const fetchTokenPrice = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  const contract = AaveOracle__factory.connect(contracts.AgaveOracle.address[chainId], provider)
  return { price: await contract.getAssetPrice(tokenAddress), tokenAddress }
}

const fetchAgTokenTotalSupply = async (tokenAddress: string, provider: JsonRpcBatchProvider) => {
  const { address: agTokenAddress } = agaveTokens.getProtocolTokenInfo(tokenAddress, 'ag')
  return {
    agTokenTotalSupply: await ERC20__factory.connect(agTokenAddress, provider).totalSupply(),
    tokenAddress,
  }
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

const fetchAgaveTokensData = async ({
  chainId,
  provider,
  underlyingTokenAddresses,
}: {
  chainId: ChainsValues
  provider: JsonRpcBatchProvider
  underlyingTokenAddresses: string[]
}) => {
  const pricesPromises: ReturnType<typeof fetchTokenPrice>[] = []
  const agTokenTotalSupplyPromises: ReturnType<typeof fetchAgTokenTotalSupply>[] = []
  const reserveDataPromise: ReturnType<typeof fetchReserveData>[] = []
  const assetDataPromise: ReturnType<typeof fetchAssetConfigurationData>[] = []

  underlyingTokenAddresses.forEach(async (tokenAddress) => {
    pricesPromises.push(fetchTokenPrice(tokenAddress, provider, chainId))
    agTokenTotalSupplyPromises.push(fetchAgTokenTotalSupply(tokenAddress, provider))
    reserveDataPromise.push(fetchReserveData(tokenAddress, provider, chainId))
    assetDataPromise.push(fetchAssetConfigurationData(tokenAddress, provider, chainId))
  })

  const combinedPromisesResolved = await Promise.allSettled([
    ...pricesPromises,
    ...agTokenTotalSupplyPromises,
    ...reserveDataPromise,
    ...assetDataPromise,
  ])

  // TODO catch errors here
  const rawResults = combinedPromisesResolved.filter(isFulfilled).map(({ value }) => value)

  const results: AgaveTokensData = rawResults.reduce((result, current) => {
    const isInResult = result?.[current.tokenAddress] || ''
    return { ...result, [current.tokenAddress]: { ...current, ...isInResult } }
  }, {} as AgaveTokensData)

  return results
}

// WARNING: batch provider accepts a maximum of 100 calls. Each token has 4 queries to get data.
// 1 token = 4 queries, 2 tokens = 8 queries, 8 tokens = 32 queries
// We must be careful if there are more than ~25 tokens in the array
const useTokensDataQuery = (underlyingTokenAddresses: string[]) => {
  const { appChainId, batchProvider } = useWeb3Connection()
  const { data, mutate: refetchAgaveTokensData } = useSWR(
    underlyingTokenAddresses?.length
      ? `agave-tokens-data-${underlyingTokenAddresses.join('-')}`
      : null,
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
    { refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL },
  )

  return {
    agaveTokensData: data,
    refetchAgaveTokensData,
  }
}

export const useAgaveTokensData = (tokens: Token[]) => {
  const underlyingTokenAddresses = tokens.map(({ address }) => address)
  const { agaveTokensData, refetchAgaveTokensData } = useTokensDataQuery(underlyingTokenAddresses)

  const getTokensWithData = useCallback(
    (showDisabledTokens: boolean) => {
      if (!agaveTokensData) {
        return
      }
      if (showDisabledTokens) {
        return agaveTokensData
      }
      const filteredDisabledTokens = Object.entries(agaveTokensData).filter(
        ([, { assetData }]) => !assetData.isFrozen,
      )

      return Object.fromEntries(filteredDisabledTokens)
    },
    [agaveTokensData],
  )

  /* Returns the market size of a token. */
  const getTokenMarketSize = useCallback(
    (tokenAddress: string) => {
      const tokenData = agaveTokensData?.[tokenAddress]
      if (!tokenData) {
        return ZERO_BN
      }
      return getMarketSize({
        tokenAddress,
        agTokenTotalSupply: tokenData.agTokenTotalSupply,
        price: tokenData.price,
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
    (tokenAddress: string, decimals: number) => {
      const tokenData = agaveTokensData?.[tokenAddress]
      if (!tokenData) {
        return { wei: ZERO_BN, dai: ZERO_BN }
      }
      const { totalStableDebt, totalVariableDebt } = tokenData.reserveData
      return {
        wei: totalStableDebt.add(totalVariableDebt),
        dai: totalStableDebt
          .add(totalVariableDebt)
          .mul(tokenData.price)
          .div(BigNumber.from(10).pow(decimals)),
      }
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
        stable: tokenData.reserveData.variableBorrowRate,
        variable: tokenData.reserveData.stableBorrowRate,
      }
    },
    [agaveTokensData],
  )

  return {
    getTokensWithData,
    refetchAgaveTokensData,
    getTokenMarketSize,
    getTotalMarketSize,
    getTokenTotalBorrowed,
    getDepositAPY,
    getBorrowRate,
  }
}

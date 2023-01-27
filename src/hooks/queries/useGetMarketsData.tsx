import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcBatchProvider } from '@ethersproject/providers'
import useSWR from 'swr'

import { agaveTokens } from '@/src/config/agaveTokens'
import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { ChainsValues } from '@/types/chains'
import {
  AaveOracle__factory,
  AaveProtocolDataProvider__factory,
  BaseIncentivesController__factory,
} from '@/types/generated/typechain'
import { isFulfilled } from '@/types/utils'

/**
 * TYPES
 */
export type IncentiveData = {
  agTokenEmissionPerSeconds: BigNumber
  variableDebtEmissionPerSeconds: BigNumber
}

export type AgaveMarketData = {
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
  const contract = AaveOracle__factory.connect(contracts.AaveOracle.address[chainId], provider)
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
    contracts.BaseIncentivesController.address[chainId],
    provider,
  )

  const agTokenIncentiveData = await contract.getAssetData(agToken.address)
  const variableDebtIncentiveData = await contract.getAssetData(variableDebtToken.address)

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
 * Takes an array of token addresses, and returns an object with AgaveMarketData for each token
 */
const fetchAgaveMarketsData = async ({
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
    const rawDataByReserveToken = rawResults.filter(({ tokenAddress }) =>
      isSameAddress(reserveAddress, tokenAddress),
    )

    let tokenData: AgaveMarketData = {} as AgaveMarketData

    rawDataByReserveToken.forEach((item) => {
      tokenData = { ...tokenData, ...item }
    })

    return tokenData
  })

  return tokensData
}

// TODO warning with the number of batch calls.
// If the array of token is to big, we can split the tokens array into small arrays of tokens (such as pagination)
export const useGetMarketsData = (reserveTokensAddresses: string[]) => {
  const { appChainId, batchProvider } = useWeb3Connection()

  // Simple cacheKey to get the cache data in other uses.
  const { data } = useSWR(
    reserveTokensAddresses?.length ? [`agave-tokens-data`, reserveTokensAddresses] : null,
    () => {
      if (!reserveTokensAddresses?.length) {
        return
      }
      const fetcherParams = {
        reserveTokensAddresses,
        provider: batchProvider,
        chainId: appChainId,
      }
      return fetchAgaveMarketsData(fetcherParams)
    },
    {
      refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
    },
  )

  return data
}

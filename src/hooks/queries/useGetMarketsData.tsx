import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcBatchProvider } from '@ethersproject/providers'
import toast from 'react-hot-toast'
import useSWR from 'swr'

import { IDAgaveTokens } from '@/src/config/agaveTokens'
import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { ChainsValues } from '@/types/chains'
import {
  AaveOracle__factory,
  AaveProtocolDataProvider,
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
  reserveData: Awaited<ReturnType<AaveProtocolDataProvider['getReserveData']>>
  assetData: Awaited<ReturnType<AaveProtocolDataProvider['getReserveConfigurationData']>>

  incentiveData: IncentiveData
}

/**
 * FETCHERS
 */
const fetchTokensPrices = async (
  tokenAddresses: string[],
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  const contract = AaveOracle__factory.connect(contracts.AaveOracle.address[chainId], provider)
  try {
    const prices = await contract.getAssetsPrices(tokenAddresses)
    return tokenAddresses.map((tokenAddress, index) => ({
      priceData: prices[index],
      tokenAddress,
    }))
  } catch (error) {
    return
  }
}

const fetchReserveData = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  try {
    return {
      reserveData: await AaveProtocolDataProvider__factory.connect(
        contracts.AaveProtocolDataProvider.address[chainId],
        provider,
      ).getReserveData(tokenAddress),
      tokenAddress,
    }
  } catch (error) {
    return
  }
}

const fetchAssetConfigurationData = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  try {
    const assetData = await AaveProtocolDataProvider__factory.connect(
      contracts.AaveProtocolDataProvider.address[chainId],
      provider,
    ).getReserveConfigurationData(tokenAddress)

    return {
      assetData,
      tokenAddress,
    }
  } catch (error) {
    return
  }
}

const fetchAssetIncentiveData = async (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
  relatedTokens: {
    agToken: string
    variableDebtToken: string
  },
) => {
  const contract = BaseIncentivesController__factory.connect(
    contracts.BaseIncentivesController.address[chainId],
    provider,
  )

  try {
    const [agTokenIncentiveData, variableDebtIncentiveData] = await Promise.all([
      contract.getAssetData(relatedTokens.agToken),
      contract.getAssetData(relatedTokens.variableDebtToken),
    ])

    return {
      incentiveData: {
        // TODO should stableDebtToken has incentiveData?
        agTokenEmissionPerSeconds: agTokenIncentiveData[1],
        variableDebtEmissionPerSeconds: variableDebtIncentiveData[1],
      },
      tokenAddress,
    }
  } catch (error) {
    return
  }
}

/**
 * Takes an array of token addresses, and returns an object with AgaveMarketData for each token
 */
const fetchAgaveMarketsData = async ({
  agaveTokens,
  chainId,
  provider,
}: {
  chainId: ChainsValues
  provider: JsonRpcBatchProvider
  agaveTokens: IDAgaveTokens
}) => {
  const reserveDataPromises: ReturnType<typeof fetchReserveData>[] = []
  const assetDataPromises: ReturnType<typeof fetchAssetConfigurationData>[] = []
  const incentiveDataPromises: ReturnType<typeof fetchAssetIncentiveData>[] = []

  const reserveTokens = agaveTokens.reserveTokens
  const reserveTokensAddresses = reserveTokens.map((token) => token.address)

  reserveTokens.forEach(async (token) => {
    reserveDataPromises.push(fetchReserveData(token.address, provider, chainId))
    assetDataPromises.push(fetchAssetConfigurationData(token.address, provider, chainId))

    const relatedTokens = agaveTokens.getRelatedTokensByAddress(token.address)
    const agToken = relatedTokens.find((item) => item.type === 'ag')?.address
    const variableDebtToken = relatedTokens.find((item) => item.type === 'variableDebt')?.address

    if (!agToken || !variableDebtToken) {
      throw new Error(`Incetive tokens not found for reserve token ${token.address}}`)
    }

    incentiveDataPromises.push(
      fetchAssetIncentiveData(token.address, provider, chainId, {
        agToken,
        variableDebtToken,
      }),
    )
  })

  const rawResults = await Promise.allSettled([
    ...reserveDataPromises,
    ...assetDataPromises,
    ...incentiveDataPromises,
    ...((await fetchTokensPrices(reserveTokensAddresses, provider, chainId)) || []), // price is getting from all tokens in one call
  ])

  const filteredRawResults = rawResults.filter(isFulfilled).map(({ value }) => value)

  /* Merge the results of the promises by reserve token address. */
  const tokensData = reserveTokensAddresses.map((reserveAddress) => {
    // Find all occurrences by reserveAddress
    const rawDataByReserveToken = filteredRawResults.filter((item) =>
      isSameAddress(reserveAddress, item?.tokenAddress || ''),
    )

    let tokenData: AgaveMarketData = {} as AgaveMarketData

    rawDataByReserveToken.forEach((item) => {
      tokenData = { ...tokenData, ...item }
    })

    return tokenData
  })
  return tokensData.filter(
    (item) => item.priceData && item.reserveData && item.assetData && item.incentiveData,
  ) // If some token data is missing, we don't return the token to avoid app crash.
}

// TODO warning with the number of batch calls.
// If the array of token is too big, we can split the tokens array into smaller chunks (such as pagination)
export const useGetMarketsData = () => {
  const { appChainId, batchProvider, batchProviderFallback } = useWeb3Connection()
  const agaveTokens = useAgaveTokens()
  const [toastDisplayed, setToastDisplayed] = useState(false)

  // Simple cacheKey to get the cache data in other uses.
  const { data, isLoading } = useSWR(
    ['agave-tokens-data', agaveTokens.reserveTokens],
    async () => {
      const result = await fetchAgaveMarketsData({
        agaveTokens,
        provider: batchProvider,
        chainId: appChainId,
      })
      if (result.length) {
        return result
      }

      const fallbackResult = await fetchAgaveMarketsData({
        agaveTokens,
        provider: batchProviderFallback,
        chainId: appChainId,
      })

      if (fallbackResult.length) {
        return fallbackResult
      }

      return []
    },
    {
      refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
      onSuccess: (data) => {
        if (data.length) {
          setToastDisplayed(false)
        }
      },
    },
  )

  useEffect(() => {
    if (!isLoading && data && data.length === 0 && !toastDisplayed) {
      setToastDisplayed(true)
      toast.error('Error on getting markets data. Please try again later.', {
        id: 'markets-data-error',
      })
    }
  }, [data, isLoading, toastDisplayed])

  return data
}

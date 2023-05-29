import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import toast from 'react-hot-toast'
import useSWR from 'swr'

import { IDAgaveTokens } from '@/src/config/agaveTokens'
import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useMarketVersion } from '@/src/hooks/useMarketVersion'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { isSameAddress } from '@/src/utils/isSameAddress'
import {
  AaveOracle,
  AaveOracle__factory,
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
  BaseIncentivesController,
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
const fetchTokensPrices = async (tokenAddresses: string[], contract: AaveOracle) => {
  try {
    const prices = await contract.getAssetsPrices(tokenAddresses)
    return tokenAddresses.map((tokenAddress, index) => ({
      priceData: prices[index],
      tokenAddress,
    }))
  } catch (error) {
    console.error('Error fetching tokens prices', error)
    return
  }
}

const fetchReserveAndAssetData = async (
  tokenAddress: string,
  contract: AaveProtocolDataProvider,
) => {
  try {
    return {
      reserveData: await contract.getReserveData(tokenAddress),
      assetData: await contract.getReserveConfigurationData(tokenAddress),
      tokenAddress,
    }
  } catch (error) {
    console.error('Error fetching reserve and asset data', error)
    return
  }
}

const fetchAssetIncentiveData = async (
  tokenAddress: string,
  contract: BaseIncentivesController,
  relatedTokens: {
    agToken: string
    variableDebtToken: string
  },
) => {
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
    console.error('Error fetching incentive data', error)
    return
  }
}

/**
 * Takes an array of token addresses, and returns an object with AgaveMarketData for each token
 */
const fetchAgaveMarketsData = async ({
  agaveTokens,
  contracts,
}: {
  contracts: {
    AaveProtocolDataProvider: AaveProtocolDataProvider
    BaseIncentivesController: BaseIncentivesController
    AaveOracle: AaveOracle
  }
  agaveTokens: IDAgaveTokens
}) => {
  const reserveAndAssetDataPromises: ReturnType<typeof fetchReserveAndAssetData>[] = []
  const incentiveDataPromises: ReturnType<typeof fetchAssetIncentiveData>[] = []

  const reserveTokens = agaveTokens.reserveTokens
  const reserveTokensAddresses = reserveTokens.map((token) => token.address)

  for (const token of reserveTokens) {
    reserveAndAssetDataPromises.push(
      fetchReserveAndAssetData(token.address, contracts.AaveProtocolDataProvider),
    )

    const relatedTokens = agaveTokens.getRelatedTokensByAddress(token.address)
    const agToken = relatedTokens.find((item) => item.type === 'ag')?.address
    const variableDebtToken = relatedTokens.find((item) => item.type === 'variableDebt')?.address

    if (!agToken || !variableDebtToken) {
      throw new Error(`Incentive tokens not found for reserve token ${token.address}}`)
    }

    incentiveDataPromises.push(
      fetchAssetIncentiveData(token.address, contracts.BaseIncentivesController, {
        agToken,
        variableDebtToken,
      }),
    )
  }

  const rawResults = await Promise.allSettled([
    ...reserveAndAssetDataPromises,
    ...incentiveDataPromises,
    ...((await fetchTokensPrices(reserveTokensAddresses, contracts.AaveOracle)) || []), // price is getting from all tokens in one call
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
  const agaveTokens = useAgaveTokens()
  const [marketVersion] = useMarketVersion()

  const [toastDisplayed, setToastDisplayed] = useState(false)

  const dataProviderContract = useContractInstance(
    AaveProtocolDataProvider__factory,
    'AaveProtocolDataProvider',
    { useSigner: false, batch: true },
  )

  const incentiveControllerContract = useContractInstance(
    BaseIncentivesController__factory,
    'BaseIncentivesController',
    { useSigner: false, batch: true },
  )

  const oracleContract = useContractInstance(AaveOracle__factory, 'AaveOracle', {
    useSigner: false,
    batch: true,
  })

  const memoFetcher = useCallback(
    () =>
      fetchAgaveMarketsData({
        agaveTokens,
        contracts: {
          AaveProtocolDataProvider: dataProviderContract,
          BaseIncentivesController: incentiveControllerContract,
          AaveOracle: oracleContract,
        },
      }),
    [agaveTokens, dataProviderContract, incentiveControllerContract, oracleContract],
  )

  // Simple cacheKey to get the cache data in other uses.
  const { data, isLoading } = useSWR(['agave-tokens-data', marketVersion], memoFetcher, {
    refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
    onSuccess: (data) => {
      if (data.length) {
        setToastDisplayed(false)
      }
    },
  })

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

import { useMemo } from 'react'

import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import useSWR from 'swr'

import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getMarketSize } from '@/src/utils/markets'
import { ChainsValues } from '@/types/chains'
import { AaveOracle__factory, ERC20__factory } from '@/types/generated/typechain'
import { Token } from '@/types/token'
import { isFulfilled } from '@/types/utils'

const REFRESH_INTERVAL = 5_000

/**
 * TYPES
 */
export type agaveTokenData = {
  price: BigNumber
  agTokenTotalSupply: BigNumber
  tokenAddress: string
}
export type AgaveTokensData = {
  [underlyingTokenAddress: string]: agaveTokenData
}

/**
 * FETCHERS
 */
const fetchTokenPrice = (
  tokenAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  const contract = AaveOracle__factory.connect(contracts.AgaveOracle.address[chainId], provider)
  return contract.getAssetPrice(tokenAddress)
}

const fetchAgTokenTotalSupply = async (tokenAddress: string, provider: JsonRpcBatchProvider) => {
  const { address: agTokenAddress } = agaveTokens.getProtocolTokenInfo(tokenAddress, 'ag')
  return ERC20__factory.connect(agTokenAddress, provider).totalSupply()
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
  const promisesBuilder = underlyingTokenAddresses.map(async (tokenAddress) => {
    return {
      tokenAddress,
      price: await fetchTokenPrice(tokenAddress, provider, chainId),
      agTokenTotalSupply: await fetchAgTokenTotalSupply(tokenAddress, provider),
    }
  })

  const rawResult = await Promise.allSettled(promisesBuilder)

  const result = rawResult.filter(isFulfilled).map(({ value }) => value)

  let results: AgaveTokensData = {}
  for (let index = 0; index < result.length; index++) {
    results = {
      ...results,
      [`${result[index].tokenAddress}`]: result[index],
    }
  }

  return results
}

export const useAgaveTokensData = (tokens?: Token[]) => {
  const { appChainId, batchProvider } = useWeb3Connection()
  const underlyingTokenAddresses = tokens?.map(({ address }) => address)

  const {
    data,
    isLoading,
    mutate: refetchAgaveTokensData,
  } = useSWR(
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
    { refreshInterval: REFRESH_INTERVAL },
  )

  /* Calculating the total market size. */
  const market = useMemo(() => {
    let marketSizes: { [tokenAddress: string]: BigNumber } = {}
    let totalMarketSize = ZERO_BN

    if (!data) {
      return {
        marketSizes,
        totalMarketSize,
      }
    }

    Object.values(data).forEach(({ agTokenTotalSupply, price, tokenAddress }) => {
      const currentMarketSize = getMarketSize({
        tokenAddress,
        agTokenTotalSupply,
        price,
      })

      marketSizes = {
        ...marketSizes,
        [tokenAddress]: currentMarketSize,
      }

      totalMarketSize = totalMarketSize.add(currentMarketSize)
    })

    return {
      marketSizes,
      totalMarketSize,
    }
  }, [data])

  return {
    agaveTokensData: data,
    refetchAgaveTokensData,
    isAgaveTokenDataLoading: isLoading,
    market,
  }
}

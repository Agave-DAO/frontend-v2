import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import useSWR from 'swr'

import { agaveTokens } from '@/src/config/agaveTokens'
import { contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ChainsValues } from '@/types/chains'
import {
  AaveOracle,
  AaveOracle__factory,
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
  AgaveLendingABI__factory,
  ERC20,
  ERC20__factory,
} from '@/types/generated/typechain'
import { Token } from '@/types/token'
import { isFulfilled } from '@/types/utils'

/**
 * TYPES
 */
export type agaveTokenData = {
  price: BigNumber
  agTokenTotalSupply: BigNumber
  // reserveData: TokenReserveData
  tokenInfo: Token
}
export type AgaveTokensData = {
  [k: string]: agaveTokenData
}

// TODO Should come from typeChain
export type TokenReserveData = {
  availableLiquidity: BigNumber
  totalStableDebt: BigNumber
  totalVariableDebt: BigNumber
  liquidityRate: BigNumber
  variableBorrowRate: BigNumber
  stableBorrowRate: BigNumber
  averageStableBorrowRate: BigNumber
  liquidityIndex: BigNumber
  variableBorrowIndex: BigNumber
  lastUpdateTimestamp: number
}

/**
 * TRANSFORMS & CALCULATIONS
 */
const transformReserveData = ({
  availableLiquidity,
  averageStableBorrowRate,
  lastUpdateTimestamp,
  liquidityIndex,
  liquidityRate,
  stableBorrowRate,
  totalStableDebt,
  totalVariableDebt,
  variableBorrowIndex,
  variableBorrowRate,
}: TokenReserveData) => ({
  availableLiquidity,
  averageStableBorrowRate,
  lastUpdateTimestamp,
  liquidityIndex,
  liquidityRate,
  stableBorrowRate,
  totalStableDebt,
  totalVariableDebt,
  variableBorrowIndex,
  variableBorrowRate,
})

/**
 * UTILS
 */

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

const fetchTokenReserveData = async (tokenAddress: string, contract: AaveProtocolDataProvider) =>
  transformReserveData(await contract.getReserveData(tokenAddress)) // TODO Can we get better type here?

const fetchAgTokenTotalSupply = async (tokenAddress: string, provider: JsonRpcBatchProvider) => {
  const { address: agTokenAddress } = agaveTokens.getProtocolTokenInfo(tokenAddress, 'ag')
  return ERC20__factory.connect(agTokenAddress, provider).totalSupply()
}

const fetchAgaveTokensData = async ({
  chainId,
  provider,
  tokens,
}: {
  chainId: ChainsValues
  provider: JsonRpcBatchProvider
  tokens: Token[]
}) => {
  const promisesBuilder = tokens.map(async (token) => {
    return {
      tokenInfo: token,
      price: await fetchTokenPrice(token.address, provider, chainId),
      agTokenTotalSupply: await fetchAgTokenTotalSupply(token.address, provider),
      // reserveData: await fetchTokenReserveData(token.address, agaveProtocolDataProvider),
    }
  })

  const rawResult = await Promise.allSettled(promisesBuilder)

  const result = rawResult.filter(isFulfilled).map(({ value }) => value)

  return result.reduce((result, current) => {
    return {
      ...result,
      [`${current.tokenInfo.address}`]: current,
    }
  }, {} as AgaveTokensData)
}

export const useAgaveTokensData = (tokens?: Token[]) => {
  const { appChainId, batchProvider } = useWeb3Connection()

  const {
    data,
    isLoading,
    mutate: refetchAgaveTokensData,
  } = useSWR(
    tokens?.length ? `agave-tokens-data-${tokens.join('-')}` : null,
    () => {
      if (!tokens?.length) {
        return
      }
      const fetcherParams = {
        tokens,
        provider: batchProvider,
        chainId: appChainId,
      }
      return fetchAgaveTokensData(fetcherParams)
    },
    { refreshInterval: 5_000, revalidateOnFocus: true },
  )

  return { agaveTokensData: data, refetchAgaveTokensData, isAgaveTokenDataLoading: isLoading }
}

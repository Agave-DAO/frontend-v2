import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import useSWR from 'swr'

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
  priceInDai: BigNumber
  reserveData: TokenReserveData
  tokenInfo: Pick<Token, 'address' | 'symbol' | 'decimals'>
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
const contractsForTokensData = (
  chainId: ChainsValues,
  provider: JsonRpcBatchProvider,
  tokenAddress: string,
) => ({
  agaveOracleContract: AaveOracle__factory.connect(
    contracts.AgaveOracle.address[chainId],
    provider,
  ),
  agaveLendingPoolContract: AgaveLendingABI__factory.connect(
    contracts.AgaveLendingPool.address[chainId],
    provider,
  ),
  agaveProtocolDataProvider: AaveProtocolDataProvider__factory.connect(
    contracts.AaveProtocolDataProvider.address[chainId],
    provider,
  ),
  AgaveTokenContract: ERC20__factory.connect(tokenAddress, provider),
})

/**
 * FETCHERS
 */
const fetchTokenPrice = (tokenAddress: string, contract: AaveOracle) =>
  contract.getAssetPrice(tokenAddress)

const fetchTokenReserveData = async (tokenAddress: string, contract: AaveProtocolDataProvider) =>
  transformReserveData(await contract.getReserveData(tokenAddress)) // TODO Can we get better type here?

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
    const { agaveOracleContract, agaveProtocolDataProvider } = contractsForTokensData(
      chainId,
      provider,
      token.address,
    )

    return {
      tokenInfo: token,
      priceInDai: await fetchTokenPrice(token.address, agaveOracleContract),
      reserveData: await fetchTokenReserveData(token.address, agaveProtocolDataProvider),
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

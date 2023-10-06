import { useMemo } from 'react'

import { BigNumber } from 'ethers'

import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import {
  ERC20__factory,
  SavingsXDaiAdapter__factory,
  SavingsXDai__factory,
} from '@/types/generated/typechain'

export const useGetTokenInfo = (tokenAddress: string) => {
  const erc20 = useContractInstance(ERC20__factory, tokenAddress)
  const calls = [erc20.name, erc20.symbol, erc20.decimals] as const

  const [{ data: tokenData }, refetchTokenData] = useContractCall(calls, [[], [], []], tokenAddress)

  return useMemo(() => {
    if (!tokenData) {
      return {
        name: '-',
        symbol: '-',
        decimals: 0,
        address: tokenAddress,
        isNative: false,
        refetch: refetchTokenData,
      }
    }

    const name = tokenData[0]
    const symbol = tokenData[1]
    const decimals = tokenData[2]

    return {
      name,
      symbol,
      decimals,
      address: tokenAddress,
      refetch: refetchTokenData,
    }
  }, [tokenData, refetchTokenData, tokenAddress])
}

export const useGetSavingsData = () => {
  const SavingsXDaiAdapterContract = useContractInstance(
    SavingsXDaiAdapter__factory,
    'SavingsXDaiAdapter',
  )
  const SavingsXDaiContract = useContractInstance(SavingsXDai__factory, 'SavingsXDai')

  const SavingsXDaiAdapterContractCalls = [SavingsXDaiAdapterContract.vaultAPY] as const
  const SavingsXDaiContractCalls = [
    SavingsXDaiContract.totalAssets,
    SavingsXDaiContract.totalSupply,
  ] as const

  const [{ data: savingsAdapterData }, refetchSavingsAdapterData] = useContractCall(
    SavingsXDaiAdapterContractCalls,
    [[]],
    `SavingsXDaiAdapterData`,
  )

  const [{ data: savingsData }, refetchSavingsData] = useContractCall(
    SavingsXDaiContractCalls,
    [[], []],
    `SavingsXDaiData`,
  )

  return useMemo(() => {
    if (!savingsAdapterData || !savingsData) {
      return {
        vaultAPY: BigNumber.from(0),
        totalAssets: BigNumber.from(0),
        totalSupply: BigNumber.from(0),
        refetch: () => {
          refetchSavingsAdapterData()
          refetchSavingsData()
        },
      }
    }
    const vaultAPY = savingsAdapterData[0] || BigNumber.from(0)
    const totalAssets = savingsData[0] || BigNumber.from(0)
    const totalSupply = savingsData[1] || BigNumber.from(0)

    return {
      vaultAPY,
      totalAssets,
      totalSupply,
      refetch: () => {
        refetchSavingsAdapterData()
        refetchSavingsData()
      },
    }
  }, [savingsAdapterData, savingsData, refetchSavingsAdapterData, refetchSavingsData])
}

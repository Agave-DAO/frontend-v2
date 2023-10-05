import { useMemo } from 'react'

import { Zero } from '@ethersproject/constants'

import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { ERC20__factory } from '@/types/generated/typechain'

// TODO (Lia): switch to src/hooks/useAccountBalance when on mainnet
export const useGetBalance = (accountAddress: string, tokenAddress: string) => {
  const erc20 = useContractInstance(ERC20__factory, tokenAddress)
  const calls = [erc20.balanceOf] as const
  const [{ data: data }, refetchData] = useContractCall(
    calls,
    [[accountAddress]],
    `balanceOf-${tokenAddress}-${accountAddress}`,
  )

  return useMemo(() => {
    if (!data) {
      return {
        balance: Zero,
        refetch: () => {
          refetchData()
        },
      }
    }

    const balance = data[0]
    return {
      balance,
      refetch: () => {
        refetchData()
      },
    }
  }, [data, refetchData])
}

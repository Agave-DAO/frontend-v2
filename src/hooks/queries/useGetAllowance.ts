import { useMemo } from 'react'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { ERC20__factory } from '@/types/generated/typechain'

export function useGetAllowance({
  from,
  to,
  tokenAddress,
}: {
  from: string
  to: string
  tokenAddress: string
}) {
  const erc20 = useContractInstance(ERC20__factory, tokenAddress)

  return useMemo(() => erc20.allowance(from, to), [erc20, to, from])
}

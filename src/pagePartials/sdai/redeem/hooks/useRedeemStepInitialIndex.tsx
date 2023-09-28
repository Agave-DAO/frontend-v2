import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'

export const useRedeemStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const SavingsXDaiAdapterAddress = contracts.SavingsXDaiAdapter.address[100]

  const { approvedAmount: allowance } = useGetERC20Allowance(
    tokenAddress,
    SavingsXDaiAdapterAddress,
  )

  return useMemo(() => {
    const isAllowanceEnough = allowance.gte(BigNumber.from(amount))
    return isAllowanceEnough ? 1 : 0
  }, [amount, allowance])
}

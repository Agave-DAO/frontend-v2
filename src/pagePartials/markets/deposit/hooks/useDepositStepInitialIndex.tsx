import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AgaveLending__factory } from '@/types/generated/typechain'

export const useDepositStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const [initialStepIndex, setInitialStepIndex] = useState(0)

  /**
   * Allowance
   */
  const { approvedAmount: allowance } = useGetERC20Allowance(tokenAddress, agaveLending.address)

  useEffect(() => {
    if (!allowance.isZero() && allowance.gte(BigNumber.from(amount))) {
      setInitialStepIndex(1)
    }
  }, [allowance, amount])

  return initialStepIndex
}

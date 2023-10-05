import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export const useRedeemStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { appChainId } = useWeb3ConnectedApp()
  const SavingsXDaiAdapterAddress = contracts['SavingsXDaiAdapter'].address[appChainId]

  const { approvedAmount: allowance } = useGetERC20Allowance(
    tokenAddress,
    SavingsXDaiAdapterAddress,
  )

  return useMemo(() => {
    const isAllowanceEnough = !allowance.isZero() && allowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [allowance, amount])
}

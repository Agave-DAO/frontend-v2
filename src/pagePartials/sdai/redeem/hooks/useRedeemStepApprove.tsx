import { useCallback, useEffect, useRef } from 'react'

import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useUserActionsContext } from '@/src/providers/userActionsProvider'
import { ERC20__factory, SavingsXDaiAdapter__factory } from '@/types/generated/typechain'

export const useRedeemStepApprove = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { unlimitedApproval } = useUserActionsContext()
  const unlimitedApprovalRef = useRef(unlimitedApproval)

  useEffect(() => {
    unlimitedApprovalRef.current = unlimitedApproval
  }, [unlimitedApproval])

  const adapter = useContractInstance(SavingsXDaiAdapter__factory, 'SavingsXDaiAdapter')
  const erc20 = useContractInstance(ERC20__factory, tokenAddress, true)
  const sendTx = useTransaction()
  const { refetchAllowance } = useGetERC20Allowance(tokenAddress, adapter.address)

  const approve = useCallback(async () => {
    const approvalAmount = unlimitedApprovalRef.current
      ? '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      : amount
    const tx = await sendTx(() => erc20.approve(adapter.address, approvalAmount))
    const receipt = await tx.wait()
    await refetchAllowance()
    return receipt.transactionHash
  }, [sendTx, refetchAllowance, erc20, adapter.address, amount])

  return useStepStates({
    title: 'Approve',
    status: 'active',
    actionText: 'Approve',
    async mainAction() {
      this.loading()

      try {
        const txHash = await approve()
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}

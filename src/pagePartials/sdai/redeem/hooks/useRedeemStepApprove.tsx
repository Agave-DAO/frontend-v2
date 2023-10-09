import { useCallback, useEffect, useRef } from 'react'

import { BigNumber } from 'ethers'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useUserActionsContext } from '@/src/providers/userActionsProvider'
import { ERC20__factory } from '@/types/generated/typechain'

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
  const adapter = contracts.SavingsXDaiAdapter.address[100]
  const erc20 = useContractInstance(ERC20__factory, tokenAddress, true)
  const sendTx = useTransaction()
  const { approvedAmount, refetchAllowance } = useGetERC20Allowance(tokenAddress, adapter)
  const neededAllowance = BigNumber.from(amount)
  const allowanceNeeded = neededAllowance.gt(approvedAmount)
    ? neededAllowance.sub(approvedAmount)
    : 0
  const approve = useCallback(async () => {
    const approvalAmount = unlimitedApprovalRef.current
      ? '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      : allowanceNeeded
    const tx = await sendTx(() => erc20.approve(adapter, approvalAmount))
    const receipt = await tx.wait()
    await refetchAllowance()
    return receipt.transactionHash
  }, [sendTx, refetchAllowance, erc20, adapter, allowanceNeeded])

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

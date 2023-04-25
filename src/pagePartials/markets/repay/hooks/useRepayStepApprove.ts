import { useCallback } from 'react'

import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { AgaveLending__factory, ERC20__factory } from '@/types/generated/typechain'

// TODO: This is a copy of useDepositStepApprove.ts. Refactor to use a single hook.
export const useRepayStepApprove = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const erc20 = useContractInstance(ERC20__factory, tokenAddress, true)
  const sendTx = useTransaction()
  const { refetchAllowance } = useGetERC20Allowance(tokenAddress, agaveLending.address)

  const approve = useCallback(async () => {
    const tx = await sendTx(() => erc20.approve(agaveLending.address, amount))
    const receipt = await tx.wait()
    await refetchAllowance()
    return receipt.transactionHash
  }, [sendTx, refetchAllowance, erc20, agaveLending.address, amount])

  return useStepStates({
    title: 'Approve',
    description: 'Approve to delegate',
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

import { useCallback } from 'react'

import { usePageModeParam } from '@/src/hooks/presentation/usePageModeParam'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory } from '@/types/generated/typechain'

export const useBorrowStepBorrow = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const interestRateMode = usePageModeParam()
  const { address: userAddress } = useWeb3ConnectedApp()
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const sendTx = useTransaction()

  const borrow = useCallback(async () => {
    const tx = await sendTx(() =>
      agaveLending.borrow(tokenAddress, amount, interestRateMode, 0, userAddress),
    )
    const receipt = await tx.wait()

    return receipt.transactionHash
  }, [sendTx, agaveLending, tokenAddress, amount, interestRateMode, userAddress])

  return useStepStates({
    title: 'Borrow',
    description: 'Submit to borrow',
    status: 'idle',
    actionText: 'Borrow',
    async mainAction() {
      this.loading()

      try {
        const txHash = await borrow()
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}

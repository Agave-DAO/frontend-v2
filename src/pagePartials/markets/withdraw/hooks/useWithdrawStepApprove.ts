import { useCallback } from 'react'

import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'

export const useWithdrawStepApprove = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  // TODO: this is a placeholder for now
  //  - this should be used only when we deal with XDAI/WXDAI
  //  - if the amount is greater than WXDAI balance, we should use the WXDAIGateway to get more from XDAI
  //  - this should be done as part of https://github.com/BootNodeDev/agave-dapp-v2/issues/76
  const approve = useCallback<() => Promise<string>>(async () => {
    return new Promise((resolve) => {
      setInterval(() => {
        resolve('')
      }, 1000)
    })
  }, [])

  return useStepStates({
    title: 'Approve',
    description: 'Submit to approve',
    status: 'idle',
    actionText: 'Approve',
    async mainAction() {
      this.loading()

      try {
        const txHash = await approve()
        this.nextStep(txHash)
      } catch (e) {
        this.failed(e?.toString() ?? 'unknown error')
      }
    },
  } as StepWithActions)
}

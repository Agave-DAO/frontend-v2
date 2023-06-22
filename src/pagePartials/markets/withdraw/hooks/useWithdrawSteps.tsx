import { useMetaSteps } from '@/src/pagePartials/markets/stepper'
import { useWithdrawStepApprove } from '@/src/pagePartials/markets/withdraw/hooks/useWithdrawStepApprove'
import { useWithdrawStepFinal } from '@/src/pagePartials/markets/withdraw/hooks/useWithdrawStepFinal'
import { useWithdrawStepInitialIndex } from '@/src/pagePartials/markets/withdraw/hooks/useWithdrawStepInitialIndex'
import { useWithdrawStepWithdraw } from '@/src/pagePartials/markets/withdraw/hooks/useWithdrawStepWithdraw'

export const useWithdrawSteps = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const approveStep = useWithdrawStepApprove({ amount, tokenAddress })
  const withdrawStep = useWithdrawStepWithdraw({ amount, tokenAddress })
  const finalStep = useWithdrawStepFinal({ amount, tokenAddress })
  const initialStepIndex = useWithdrawStepInitialIndex({
    amount,
    tokenAddress,
  })

  const displayedSteps =
    tokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
      ? [approveStep, withdrawStep, finalStep]
      : [withdrawStep, finalStep]

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: displayedSteps,
  })
}

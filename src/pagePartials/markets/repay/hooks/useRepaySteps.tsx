import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useRepayStepApprove } from '@/src/pagePartials/markets/repay/hooks/useRepayStepApprove'
import { useRepayStepFinal } from '@/src/pagePartials/markets/repay/hooks/useRepayStepFinal'
import { useRepayStepInitialIndex } from '@/src/pagePartials/markets/repay/hooks/useRepayStepInitialIndex'
import { useRepayStepRepay } from '@/src/pagePartials/markets/repay/hooks/useRepayStepRepay'
import { useMetaSteps } from '@/src/pagePartials/markets/stepper'

export const useRepaySteps = ({
  amount,
  interestRateMode,
  tokenAddress,
}: {
  amount: string
  interestRateMode: InterestRateMode
  tokenAddress: string
}) => {
  const approveStep = useRepayStepApprove({ amount, tokenAddress })
  const repayStep = useRepayStepRepay({ amount, interestRateMode, tokenAddress })
  const finalStep = useRepayStepFinal({ amount, tokenAddress })
  const initialStepIndex = useRepayStepInitialIndex({
    amount,
    tokenAddress,
  })

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: [approveStep, repayStep, finalStep],
  })
}

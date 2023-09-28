import { useMetaSteps } from '@/src/pagePartials/markets/stepper'
import { useRedeemStepApprove } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepApprove'
import { useRedeemStepFinal } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepFinal'
import { useRedeemStepInitialIndex } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepInitialIndex'
import { useRedeemStepRedeem } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepRedeem'

export const useRedeemSteps = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const approveStep = useRedeemStepApprove({ amount, tokenAddress })
  const redeemStep = useRedeemStepRedeem({ amount, tokenAddress })
  const finalStep = useRedeemStepFinal({ amount, tokenAddress })
  const initialStepIndex = useRedeemStepInitialIndex({
    amount,
    tokenAddress,
  })

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: [approveStep, redeemStep, finalStep],
  })
}

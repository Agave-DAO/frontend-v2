import { useMetaSteps } from '@/src/pagePartials/markets/stepper'
import { Token } from '@/src/pagePartials/sdai/DepositRedeem'
import { useRedeemStepApprove } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepApprove'
import { useRedeemStepFinal } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepFinal'
import { useRedeemStepInitialIndex } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepInitialIndex'
import { useRedeemStepRedeem } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepRedeem'

export const useRedeemSteps = ({
  amount,
  cancel,
  selectedToken,
  tokenAddress,
}: {
  amount: string
  cancel: () => void
  selectedToken: Token
  tokenAddress: string
}) => {
  const approveStep = useRedeemStepApprove({ amount, tokenAddress })
  const redeemStep = useRedeemStepRedeem({ amount, selectedToken, tokenAddress })
  const finalStep = useRedeemStepFinal({ amount, cancel, tokenAddress })
  const initialStepIndex = useRedeemStepInitialIndex({
    amount,
    tokenAddress,
  })

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: [approveStep, redeemStep, finalStep],
  })
}

import { useDepositStepApprove } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepApprove'
import { useDepositStepDeposit } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepDeposit'
import { useDepositStepFinal } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepFinal'
import { useDepositStepInitialIndex } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepInitialIndex'
import { useMetaSteps } from '@/src/pagePartials/markets/stepper'

export const useDepositSteps = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const approveStep = useDepositStepApprove({ amount, tokenAddress })
  const depositStep = useDepositStepDeposit({ amount, tokenAddress })
  const finalStep = useDepositStepFinal({ amount, tokenAddress })
  const initialStepIndex = useDepositStepInitialIndex({
    amount,
    tokenAddress,
  })

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: [approveStep, depositStep, finalStep],
  })
}

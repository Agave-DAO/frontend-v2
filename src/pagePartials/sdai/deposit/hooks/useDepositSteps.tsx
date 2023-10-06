import { useDepositStepInitial } from './useDepositStepInitial'
import { useMetaSteps } from '@/src/pagePartials/markets/stepper'
import { useDepositStepApprove } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepApprove'
import { useDepositStepDeposit } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepDeposit'
import { useDepositStepFinal } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepFinal'
import { useDepositStepInitialIndex } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepInitialIndex'

export const useDepositSteps = ({
  amount,
  cancel,
  tokenAddress,
}: {
  amount: string
  cancel: () => void
  tokenAddress: string
}) => {
  const approveStep = useDepositStepApprove({ amount, tokenAddress })
  const depositStep = useDepositStepDeposit({ amount, tokenAddress })
  const finalStep = useDepositStepFinal({ amount, cancel, tokenAddress })
  const initialStepIndex = useDepositStepInitialIndex({
    amount,
    tokenAddress,
  })

  const { tokenInfo } = useDepositStepInitial({ amount, tokenAddress })
  const isNativeToken = tokenInfo.symbol === 'XDAI'

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: isNativeToken
      ? [depositStep, finalStep]
      : [approveStep, depositStep, finalStep],
  })
}

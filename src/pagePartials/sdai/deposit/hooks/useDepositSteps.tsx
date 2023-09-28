import { useMetaSteps } from '@/src/pagePartials/markets/stepper'
import { useDepositStepApprove } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepApprove'
import { useDepositStepDeposit } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepDeposit'
import { useDepositStepFinal } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepFinal'
import { useDepositStepInitialIndex } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepInitialIndex'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

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

  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: isNativeToken
      ? [depositStep, finalStep]
      : [approveStep, depositStep, finalStep],
  })
}

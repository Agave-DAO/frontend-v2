import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useBorrowStepBorrow } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepBorrow'
import { useBorrowStepDelegate } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepDelegate'
import { useBorrowStepFinal } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepFinal'
import { useBorrowStepInitialIndex } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepInitialIndex'
import { useDepositStepInitial } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepInitial'
import { useMetaSteps } from '@/src/pagePartials/markets/stepper'

export const useBorrowSteps = ({
  amount,
  interestRateMode,
  tokenAddress,
}: {
  amount: string
  interestRateMode: InterestRateMode
  tokenAddress: string
}) => {
  const approveStep = useBorrowStepDelegate({ amount, tokenAddress })
  const borrowStep = useBorrowStepBorrow({ amount, interestRateMode, tokenAddress })
  const finalStep = useBorrowStepFinal({ amount, tokenAddress })
  const initialStepIndex = useBorrowStepInitialIndex({
    amount,
    tokenAddress,
  })

  const { tokenInfo } = useDepositStepInitial({ amount, tokenAddress })
  const isNativeToken = tokenInfo.symbol === 'XDAI'

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: !isNativeToken
      ? [borrowStep, finalStep]
      : [approveStep, borrowStep, finalStep],
  })
}

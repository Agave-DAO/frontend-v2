import { useBorrowStepBorrow } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepBorrow'
import { useBorrowStepDelegate } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepDelegate'
import { useBorrowStepFinal } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepFinal'
import { useBorrowStepInitialIndex } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepInitialIndex'
import { useMetaSteps } from '@/src/pagePartials/markets/stepper'

export const useBorrowSteps = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const approveStep = useBorrowStepDelegate({ amount, tokenAddress })
  const borrowStep = useBorrowStepBorrow({ amount, tokenAddress })
  const finalStep = useBorrowStepFinal({ amount, tokenAddress })
  const initialStepIndex = useBorrowStepInitialIndex({
    amount,
    tokenAddress,
  })

  return useMetaSteps({
    initialStepIndex,
    stepsWithDispatchers: [approveStep, borrowStep, finalStep],
  })
}

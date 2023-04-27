import { useRouter } from 'next/router'

import { BigNumber } from '@ethersproject/bignumber'

import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useModalsContext } from '@/src/providers/modalsProvider'
import { formatAmount } from '@/src/utils/common'

export const useBorrowStepFinal = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const router = useRouter()
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)
  const formattedAmount = formatAmount(
    BigNumber.from(amount),
    tokenInfo.decimals,
    tokenInfo.symbol,
    'after',
  )

  const { closeModal } = useModalsContext()

  const final = () => {
    router.push('/my-account')
    closeModal()
  }

  return useStepStates({
    title: 'Done',
    description: `Borrow of ${formattedAmount} successful`,
    status: 'idle',
    async mainAction() {
      await final()
    },
    actionText: 'Go to My Account',
  } as StepWithActions)
}

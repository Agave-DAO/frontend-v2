import { useRouter } from 'next/router'

import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useTokenActionsModalsContext } from '@/src/providers/tokenActionsModalProvider'
import { formatAmount } from '@/src/utils/common'

export const useWithdrawStepFinal = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const router = useRouter()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const formattedAmount = formatAmount(
    BigNumber.from(amount),
    tokenInfo.decimals,
    tokenInfo.symbol,
    'after',
  )

  const { closeModal } = useTokenActionsModalsContext()

  const final = () => {
    router.push('/my-account')
    closeModal()
  }

  return useStepStates({
    title: 'Done',
    description: `Withdrawal of ${formattedAmount} successful`,
    status: 'idle',
    async mainAction() {
      await final()
    },
    actionText: 'Go to My Account',
  } as StepWithActions)
}

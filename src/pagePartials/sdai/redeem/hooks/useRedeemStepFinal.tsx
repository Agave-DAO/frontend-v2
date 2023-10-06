import { BigNumber } from '@ethersproject/bignumber'

import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { formatAmount } from '@/src/utils/common'

export const useRedeemStepFinal = ({
  amount,
  cancel,
  tokenAddress,
}: {
  amount: string
  cancel: () => void
  tokenAddress: string
}) => {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const formattedAmount = formatAmount(
    BigNumber.from(amount),
    tokenInfo.decimals,
    tokenInfo.symbol,
    'after',
  )

  const final = () => {
    cancel()
  }

  return useStepStates({
    title: 'Done',
    description: `Redeem of ${formattedAmount} successful`,
    status: 'idle',
    async mainAction() {
      await final()
    },
    actionText: 'Finish',
  } as StepWithActions)
}

import { BigNumber } from '@ethersproject/bignumber'

import { useGetTokenInfo } from '@/src/hooks/queries/useGetSavingsData'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
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
  const tokenInfo = useGetTokenInfo(tokenAddress)
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

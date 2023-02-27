import { BigNumber } from '@ethersproject/bignumber'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { Amount } from '@/src/components/helpers/Amount'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useRepaySteps } from '@/src/pagePartials/markets/repay/hooks/useRepaySteps'
import { Steps } from '@/src/pagePartials/markets/stepper'

interface RepayStepperInfoProps {
  amount: string
  tokenAddress: string
}

const RepayStepperInfo = ({ amount, tokenAddress }: RepayStepperInfoProps) => {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const newHealthFactor = 0

  return (
    <>
      <div data-id="summary">
        <p>These are your transaction details.</p>
        <p>Please verify them before submitting.</p>
      </div>
      <div data-id="info-amount">
        <div>Amount</div>
        <Amount
          decimals={tokenInfo.decimals}
          symbol={tokenInfo.symbol}
          value={BigNumber.from(amount)}
        />
      </div>
      <div data-id="info-newHealthFactor">
        <div>New health factor</div>
        <div>{newHealthFactor}%</div>
      </div>
    </>
  )
}

interface RepayStepperProps {
  amount: string
  cancel: () => void
  tokenAddress: string
}

export function RepayStepper({ amount, cancel, tokenAddress }: RepayStepperProps) {
  const depositSteps = useRepaySteps({
    tokenAddress,
    amount,
  })

  const params = {
    ...depositSteps,
    info: <RepayStepperInfo amount={amount} tokenAddress={tokenAddress} />,
    title: 'Repay overview',
    titleButton: <ButtonPrimary onClick={cancel}>Cancel</ButtonPrimary>,
  }

  return <Steps {...params} />
}

import { BigNumber } from '@ethersproject/bignumber'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { Amount } from '@/src/components/helpers/Amount'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useBorrowSteps } from '@/src/pagePartials/markets/borrow/hooks/useBorrowSteps'
import { Steps } from '@/src/pagePartials/markets/stepper'

interface BorrowStepperInfoProps {
  amount: string
  tokenAddress: string
}

const BorrowStepperInfo = ({ amount, tokenAddress }: BorrowStepperInfoProps) => {
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

interface BorrowStepperProps {
  amount: string
  cancel: () => void
  tokenAddress: string
}

export function BorrowStepper({ amount, cancel, tokenAddress }: BorrowStepperProps) {
  const depositSteps = useBorrowSteps({
    tokenAddress,
    amount,
  })

  const params = {
    ...depositSteps,
    info: <BorrowStepperInfo amount={amount} tokenAddress={tokenAddress} />,
    title: 'Borrow overview',
    titleButton: <ButtonPrimary onClick={cancel}>Cancel</ButtonPrimary>,
  }

  return <Steps {...params} />
}

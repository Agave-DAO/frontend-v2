import { BigNumber } from '@ethersproject/bignumber'

import { Amount } from '@/src/components/helpers/Amount'
import { HealthFactor } from '@/src/components/helpers/HealthFactor'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useBorrowSteps } from '@/src/pagePartials/markets/borrow/hooks/useBorrowSteps'
import { Steps } from '@/src/pagePartials/markets/stepper'

interface BorrowStepperInfoProps {
  amount: string
  tokenAddress: string
}

const BorrowStepperInfo = ({ amount, tokenAddress }: BorrowStepperInfoProps) => {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: BigNumber.from(amount),
    type: 'borrow',
  })

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
        <div>
          <HealthFactor value={newHealthFactor} />
        </div>
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
    titleButton: { onClick: cancel, text: 'Cancel', variant: 'danger' as const },
  }

  return <Steps {...params} />
}

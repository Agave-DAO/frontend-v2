import { BigNumber } from '@ethersproject/bignumber'

import { HealthFactor } from '@/src/components/common/HealthFactor'
import { Row, RowKey, RowValue, RowValueBig, Text } from '@/src/components/common/StepsCard'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useBorrowSteps } from '@/src/pagePartials/markets/borrow/hooks/useBorrowSteps'
import { Steps } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

interface BorrowStepperInfoProps {
  amount: string
  tokenAddress: string
}

const BorrowStepperInfo = ({ amount, tokenAddress }: BorrowStepperInfoProps) => {
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)
  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: BigNumber.from(amount),
    type: 'borrow',
  })

  return (
    <>
      <Text>
        These are your transaction details.
        <br />
        Please verify them before submitting.
      </Text>
      <Row variant="dark">
        <RowKey>Amount</RowKey>
        <RowValueBig>
          <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
          <Amount decimals={tokenInfo.decimals} symbol="" value={BigNumber.from(amount)} />
        </RowValueBig>
      </Row>
      <Row variant="dark">
        <RowKey>New health factor</RowKey>
        <RowValue>
          <HealthFactor badgeVariant="light" size="sm" value={newHealthFactor} variant="light" />
        </RowValue>
      </Row>
    </>
  )
}

interface BorrowStepperProps {
  amount: string
  cancel: () => void
  interestRateMode: InterestRateMode
  tokenAddress: string
}

export const BorrowStepper = ({
  amount,
  cancel,
  interestRateMode,
  tokenAddress,
}: BorrowStepperProps) => {
  const depositSteps = useBorrowSteps({
    amount,
    interestRateMode,
    tokenAddress,
  })

  const params = {
    ...depositSteps,
    info: <BorrowStepperInfo amount={amount} tokenAddress={tokenAddress} />,
    title: 'Borrow overview',
    titleButton: { onClick: cancel, text: 'Cancel', variant: 'danger' as const },
  }

  return <Steps {...params} />
}

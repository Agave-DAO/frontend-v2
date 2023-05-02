import { BigNumber } from '@ethersproject/bignumber'

import { HealthFactor } from '@/src/components/common/HealthFactor'
import { Row, RowKey, RowValue, RowValueBig, Text } from '@/src/components/common/StepsCard'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useRepaySteps } from '@/src/pagePartials/markets/repay/hooks/useRepaySteps'
import { Steps } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

interface RepayStepperInfoProps {
  amount: string
  tokenAddress: string
}

const RepayStepperInfo = ({ amount, tokenAddress }: RepayStepperInfoProps) => {
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)

  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: BigNumber.from(amount),
    type: 'repay',
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

interface RepayStepperProps {
  amount: string
  cancel: () => void
  interestRateMode: InterestRateMode
  tokenAddress: string
}

export const RepayStepper = ({
  amount,
  cancel,
  interestRateMode,
  tokenAddress,
}: RepayStepperProps) => {
  const depositSteps = useRepaySteps({
    amount,
    interestRateMode,
    tokenAddress,
  })

  const params = {
    ...depositSteps,
    info: <RepayStepperInfo amount={amount} tokenAddress={tokenAddress} />,
    title: 'Repay overview',
    titleButton: { onClick: cancel, text: 'Cancel', variant: 'danger' as const },
  }

  return <Steps {...params} />
}

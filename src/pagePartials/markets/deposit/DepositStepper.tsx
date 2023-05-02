import { BigNumber } from '@ethersproject/bignumber'

import { HealthFactor } from '@/src/components/common/HealthFactor'
import { Row, RowKey, RowValue, RowValueBig, Text } from '@/src/components/common/StepsCard'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useDepositSteps } from '@/src/pagePartials/markets/deposit/hooks/useDepositSteps'
import { Steps } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

interface DepositStepperInfoProps {
  amount: string
  tokenAddress: string
}

const DepositStepperInfo = ({ amount, tokenAddress }: DepositStepperInfoProps) => {
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)
  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: BigNumber.from(amount),
    type: 'deposit',
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

interface DepositStepperProps {
  amount: string
  cancel: () => void
  tokenAddress: string
}

export const DepositStepper = ({ amount, cancel, tokenAddress }: DepositStepperProps) => {
  const depositSteps = useDepositSteps({
    tokenAddress,
    amount,
  })

  const params = {
    ...depositSteps,
    info: <DepositStepperInfo amount={amount} tokenAddress={tokenAddress} />,
    title: 'Deposit overview',
    titleButton: { onClick: cancel, text: 'Cancel', variant: 'danger' as const },
  }

  return <Steps {...params} />
}

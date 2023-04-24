import { BigNumber } from '@ethersproject/bignumber'

import { Row, RowKey, RowValue, RowValueBig, Text } from '@/src/components/card/StepsCard'
import { HealthFactor } from '@/src/components/healthFactor/HealthFactor'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { Steps } from '@/src/pagePartials/markets/stepper'
import { useWithdrawSteps } from '@/src/pagePartials/markets/withdraw/hooks/useWithdrawSteps'

interface WithdrawStepperInfoProps {
  amount: string
  tokenAddress: string
}

const WithdrawStepperInfo = ({ amount, tokenAddress }: WithdrawStepperInfoProps) => {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: BigNumber.from(amount),
    type: 'withdraw',
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

interface WithdrawStepperProps {
  amount: string
  cancel: () => void
  tokenAddress: string
}

export const WithdrawStepper = ({ amount, cancel, tokenAddress }: WithdrawStepperProps) => {
  const depositSteps = useWithdrawSteps({
    tokenAddress,
    amount,
  })

  const params = {
    ...depositSteps,
    info: <WithdrawStepperInfo amount={amount} tokenAddress={tokenAddress} />,
    title: 'Withdraw overview',
    titleButton: { onClick: cancel, text: 'Cancel', variant: 'danger' as const },
  }

  return <Steps {...params} />
}

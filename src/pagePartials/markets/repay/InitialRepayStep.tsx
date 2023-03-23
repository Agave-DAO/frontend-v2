import { Dispatch, SetStateAction, useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { HealthFactor } from '@/src/components/common/HealthFactor'
import { Button, Row, RowKey, RowValue } from '@/src/components/common/StepsCard'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useRepayStepInitial } from '@/src/pagePartials/markets/repay/hooks/useRepayStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'

interface InitialRepayStepInfoProps {
  amount: string
  maxToRepay: BigNumber
  tokenAddress: string
  tokenInfo: TokenWithType
}

const InitialRepayStepInfo: React.FC<InitialRepayStepInfoProps> = ({
  amount,
  maxToRepay,
  tokenAddress,
  tokenInfo,
}) => {
  const sanitizedAmount = useMemo(() => BigNumber.from(amount ? amount : 0), [amount])
  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: sanitizedAmount,
    type: 'repay',
  })

  return (
    <>
      <Row>
        <RowKey>Available to repay</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
          <Amount
            decimals={tokenInfo.decimals}
            displayDecimals={tokenInfo.decimals}
            symbol=""
            value={maxToRepay}
          />
        </RowValue>
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

interface InitialRepayStepProps {
  amount: string
  nextStep: () => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialRepayStep: React.FC<InitialRepayStepProps> = ({
  amount,
  nextStep,
  setAmount,
  tokenAddress,
}) => {
  const {
    disableSubmit,
    maxToRepay,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useRepayStepInitial({ amount, tokenAddress })

  const stepperProps = {
    info: (
      <InitialRepayStepInfo
        amount={amount}
        maxToRepay={maxToRepay}
        tokenAddress={tokenAddress}
        tokenInfo={tokenInfo}
      />
    ),
    title: 'Amount to repay',
    titleButton: { onClick: () => setAmount(maxToRepay.toString()), text: 'Use max' },
  }

  return (
    <Stepper {...stepperProps}>
      <TokenInput
        address={tokenAddress}
        decimals={tokenInfo.decimals}
        maxValue={maxToRepay.toString()}
        setStatus={setTokenInputStatus}
        setStatusText={setTokenInputStatusText}
        setValue={setAmount}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
        symbol={tokenInfo.symbol}
        value={amount}
      />
      <Button disabled={disableSubmit} onClick={nextStep}>
        Repay
      </Button>
    </Stepper>
  )
}

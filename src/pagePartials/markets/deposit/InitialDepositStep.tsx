import { Dispatch, SetStateAction, useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { HealthFactor } from '@/src/components/common/HealthFactor'
import {
  Button,
  ButtonWrapper,
  Row,
  RowKey,
  RowValue,
  StepActionButton,
  Text,
} from '@/src/components/common/StepsCard'
import { Amount } from '@/src/components/helpers/Amount'
import { ToggleWrap } from '@/src/components/token/ToggleWrap'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useDepositStepInitial } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { useModalsContext } from '@/src/providers/modalsProvider'

interface InitialDepositStepInfoProps {
  amount: string
  balance: BigNumber
  tokenAddress: string
  tokenInfo: TokenWithType
}

const InitialDepositStepInfo: React.FC<InitialDepositStepInfoProps> = ({
  amount,
  balance,
  tokenAddress,
  tokenInfo,
}) => {
  const sanitizedAmount = useMemo(() => BigNumber.from(amount ? amount : 0), [amount])
  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: sanitizedAmount,
    type: 'deposit',
  })

  return (
    <>
      <Text>
        Need to bridge assets to Gnosis
        <br />
        from other chains? Please visit <a href="https://li.fi">li.fi</a>
      </Text>
      <Row>
        <RowKey>Available to deposit</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
          <Amount decimals={tokenInfo.decimals} displayDecimals={3} symbol="" value={balance} />
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

interface InitialDepositStepProps {
  amount: string
  nextStep: () => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialDepositStep: React.FC<InitialDepositStepProps> = ({
  amount,
  nextStep,
  setAmount,
  tokenAddress,
}) => {
  const {
    balance,
    disableSubmit,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useDepositStepInitial({ amount, tokenAddress })
  const { openMinHealthConfigurationModal } = useModalsContext()

  const onToggleWrap = (isWrapped: boolean) => {
    console.log(isWrapped)
  }

  const isXDAI = tokenInfo.symbol.toLowerCase() === 'xdai'
  const isWXDAI = tokenInfo.symbol.toLowerCase() === 'wxdai'

  const wizardProps = {
    info: (
      <InitialDepositStepInfo
        amount={amount}
        balance={balance}
        tokenAddress={tokenAddress}
        tokenInfo={tokenInfo}
      />
    ),
    title: 'Amount to deposit',
    titleButton: {
      onClick: () => setAmount(balance.toString()),
      text: 'Use max',
    },
    tokenWrapper:
      isXDAI || isWXDAI ? <ToggleWrap isWrapped={isWXDAI} onChange={onToggleWrap} /> : null,
  }

  return (
    <Stepper {...wizardProps}>
      <TokenInput
        address={tokenAddress}
        decimals={tokenInfo.decimals}
        maxValue={balance.toString()}
        setStatus={setTokenInputStatus}
        setStatusText={setTokenInputStatusText}
        setValue={setAmount}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
        symbol={tokenInfo.symbol}
        value={amount}
      />
      <ButtonWrapper>
        <Button disabled={disableSubmit} onClick={nextStep}>
          Deposit
        </Button>
        <StepActionButton onClick={openMinHealthConfigurationModal}>
          Min health factor configuration
        </StepActionButton>
      </ButtonWrapper>
    </Stepper>
  )
}

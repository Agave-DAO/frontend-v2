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
} from '@/src/components/common/StepsCard'
import { Amount } from '@/src/components/helpers/Amount'
import { ToggleWrap } from '@/src/components/token/ToggleWrap'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { TokenWithType, agaveTokens } from '@/src/config/agaveTokens'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useRepayStepInitial } from '@/src/pagePartials/markets/repay/hooks/useRepayStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { useModalsContext } from '@/src/providers/modalsProvider'
import { NumberType } from '@/src/utils/format'
import { Token } from '@/types/token'

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
            numberType={NumberType.TokenTx}
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
  onTokenSelect: (token: Token) => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialRepayStep: React.FC<InitialRepayStepProps> = ({
  amount,
  nextStep,
  onTokenSelect,
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
  const { openMinHealthConfigurationModal } = useModalsContext()

  const onToggleWrap = (isWrapped: boolean) => {
    onTokenSelect(isWrapped ? agaveTokens.wrapperToken : agaveTokens.nativeToken)
  }

  const isNativeRelated = tokenInfo.extensions.isNative || tokenInfo.extensions.isNativeWrapper

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
    tokenWrapper: isNativeRelated ? (
      <ToggleWrap isWrapped={tokenInfo.extensions.isNativeWrapper} onChange={onToggleWrap} />
    ) : null,
  }

  return (
    <Stepper {...stepperProps}>
      <TokenInput
        address={isNativeRelated ? agaveTokens.wrapperToken.address : tokenAddress}
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
      <ButtonWrapper>
        <Button disabled={disableSubmit} onClick={nextStep}>
          Repay
        </Button>
        <StepActionButton onClick={openMinHealthConfigurationModal}>
          Min health factor configuration
        </StepActionButton>
      </ButtonWrapper>
    </Stepper>
  )
}

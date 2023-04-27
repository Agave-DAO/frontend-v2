import { Dispatch, SetStateAction, useMemo, useState } from 'react'

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
import { TabToggle } from '@/src/components/common/TabToggle'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useRepayStepInitial } from '@/src/pagePartials/markets/repay/hooks/useRepayStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
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
  interestRateMode: InterestRateMode
  nextStep: () => void
  onInterestRateSelect: (mode: InterestRateMode) => void
  onTokenSelect: (token: Token) => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialRepayStep: React.FC<InitialRepayStepProps> = ({
  amount,
  interestRateMode,
  nextStep,
  onInterestRateSelect,
  onTokenSelect,
  setAmount,
  tokenAddress,
}) => {
  const {
    disableSubmit,
    isStableBorrowRateEnabled,
    maxToRepay,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useRepayStepInitial({ amount, interestRateMode, tokenAddress })
  const { openMinHealthConfigurationModal } = useModalsContext()
  const market = useMarketsData().getMarket(tokenAddress)
  const agaveTokens = useAgaveTokens()

  const onToggleInterestRateMode = (isToggled: boolean) => {
    onInterestRateSelect(isToggled ? InterestRateMode.stable : InterestRateMode.variable)
  }

  const onToggleWrap = (isToggled: boolean) => {
    onTokenSelect(isToggled ? agaveTokens.wrapperToken : agaveTokens.nativeToken)
    !isToggled && // means we are using the native token
      onToggleInterestRateMode(false) // so we need to set the interest rate mode to variable
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
    toggles: (
      <>
        {isNativeRelated && (
          <TabToggle
            isToggled={tokenInfo.extensions.isNativeWrapper}
            onChange={onToggleWrap}
            toggleOptions={{
              toggledButton: 'WXDAI',
              toggledText: 'Wrapped token',
              untoggledButton: 'XDAI',
              untoggledText: 'Unwrapped token',
            }}
          />
        )}
        <TabToggle
          disabled={!isStableBorrowRateEnabled}
          isToggled={interestRateMode === InterestRateMode.stable}
          onChange={onToggleInterestRateMode}
          toggleOptions={{
            toggledButton: 'Stable',
            toggledText: <></>,
            untoggledButton: 'Variable',
            untoggledText: <></>,
          }}
        />
      </>
    ),
  }

  return (
    <Stepper {...stepperProps}>
      <TokenInput
        decimals={tokenInfo.decimals}
        maxValue={maxToRepay.toString()}
        setStatus={setTokenInputStatus}
        setStatusText={setTokenInputStatusText}
        setValue={setAmount}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
        symbol={tokenInfo.symbol}
        usdPrice={market.priceData}
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

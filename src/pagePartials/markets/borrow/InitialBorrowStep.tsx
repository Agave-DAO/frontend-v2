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
import { TabToggle } from '@/src/components/common/TabToggle'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useBorrowStepInitial } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useModalsContext } from '@/src/providers/modalsProvider'
import { NumberType } from '@/src/utils/format'
import { Token } from '@/types/token'

interface InitialBorrowStepInfoProps {
  amount: string
  maxToBorrow: BigNumber
  tokenAddress: string
  tokenInfo: TokenWithType
}

const InitialBorrowStepInfo: React.FC<InitialBorrowStepInfoProps> = ({
  amount,
  maxToBorrow,
  tokenAddress,
  tokenInfo,
}) => {
  const sanitizedAmount = useMemo(() => BigNumber.from(amount ? amount : 0), [amount])
  const newHealthFactor = useNewHealthFactorCalculator(tokenAddress).newHealthFactor({
    amount: sanitizedAmount,
    type: 'borrow',
  })

  return (
    <>
      <Row>
        <RowKey>Available to borrow</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
          <Amount
            decimals={tokenInfo.decimals}
            numberType={NumberType.TokenTx}
            symbol=""
            value={maxToBorrow}
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

interface InitialBorrowStepProps {
  amount: string
  interestRateMode: InterestRateMode
  nextStep: () => void
  onInterestRateSelect: (mode: InterestRateMode) => void
  onTokenSelect: (token: Token) => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialBorrowStep: React.FC<InitialBorrowStepProps> = ({
  amount,
  interestRateMode,
  nextStep,
  onInterestRateSelect,
  onTokenSelect,
  setAmount,
  tokenAddress,
}) => {
  const {
    borrowStableAPR,
    borrowVariableAPR,
    disableSubmit,
    isStableBorrowRateEnabled,
    maxToBorrow,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useBorrowStepInitial({ amount, tokenAddress })
  const market = useMarketsData().getMarket(tokenAddress)
  const agaveTokens = useAgaveTokens()
  const { openMinHealthConfigurationModal } = useModalsContext()

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
      <InitialBorrowStepInfo
        amount={amount}
        maxToBorrow={maxToBorrow}
        tokenAddress={tokenAddress}
        tokenInfo={tokenInfo}
      />
    ),
    title: 'Amount to borrow',
    titleButton: { onClick: () => setAmount(maxToBorrow.toString()), text: 'Use max' },
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
            toggledText: (
              <>
                Stable APR{' '}
                <b>
                  <Percentage decimals={25} value={borrowStableAPR} />
                </b>
              </>
            ),
            untoggledButton: 'Variable',
            untoggledText: (
              <>
                Variable APR{' '}
                <b>
                  <Percentage decimals={25} value={borrowVariableAPR} />
                </b>
              </>
            ),
          }}
        />
      </>
    ),
  }

  return (
    <Stepper {...stepperProps}>
      <TokenInput
        decimals={tokenInfo.decimals}
        maxValue={maxToBorrow.toString()}
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
          Borrow
        </Button>
        <StepActionButton onClick={openMinHealthConfigurationModal}>
          Min health factor configuration
        </StepActionButton>
      </ButtonWrapper>
    </Stepper>
  )
}

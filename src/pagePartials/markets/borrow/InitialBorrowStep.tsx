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
import { TokenWithType, agaveTokens } from '@/src/config/agaveTokens'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useBorrowStepInitial } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'
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
  nextStep: () => void
  onTokenSelect: (token: Token) => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialBorrowStep: React.FC<InitialBorrowStepProps> = ({
  amount,
  nextStep,
  onTokenSelect,
  setAmount,
  tokenAddress,
}) => {
  const {
    disableSubmit,
    maxToBorrow,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useBorrowStepInitial({ amount, tokenAddress })
  const { openMinHealthConfigurationModal } = useModalsContext()

  const onToggleWrap = (isToggled: boolean) => {
    onTokenSelect(isToggled ? agaveTokens.wrapperToken : agaveTokens.nativeToken)
  }

  const isNativeRelated = tokenInfo.extensions.isNative || tokenInfo.extensions.isNativeWrapper
  const [APR, setAPR] = useState<'variable' | 'stable'>('variable')

  const onToggleAPR = (isToggled: boolean) => {
    setAPR(isToggled ? 'stable' : 'variable')
  }

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
          isToggled={APR === 'stable'}
          onChange={onToggleAPR}
          toggleOptions={{
            toggledButton: 'Stable',
            toggledText: (
              <>
                Stable APR <b>0.1205%</b>
              </>
            ),
            untoggledButton: 'Variable',
            untoggledText: (
              <>
                Variable APR <b>0.4211%</b>
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
        address={isNativeRelated ? agaveTokens.wrapperToken.address : tokenAddress}
        decimals={tokenInfo.decimals}
        maxValue={maxToBorrow.toString()}
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
          Borrow
        </Button>
        <StepActionButton onClick={openMinHealthConfigurationModal}>
          Min health factor configuration
        </StepActionButton>
      </ButtonWrapper>
    </Stepper>
  )
}

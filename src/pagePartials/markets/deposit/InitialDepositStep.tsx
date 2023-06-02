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
import { TabToggle } from '@/src/components/common/TabToggle'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useDepositStepInitial } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useModalsContext } from '@/src/providers/modalsProvider'
import { NumberType } from '@/src/utils/format'
import { Token } from '@/types/token'

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
        from other chains? Consider using <a href="https://jumper.exchange/">jumper</a>
      </Text>
      <Row>
        <RowKey>Available to deposit</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
          <Amount
            decimals={tokenInfo.decimals}
            numberType={NumberType.TokenTx}
            symbol=""
            value={balance}
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

interface InitialDepositStepProps {
  amount: string
  nextStep: () => void
  onTokenSelect: (token: Token) => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialDepositStep: React.FC<InitialDepositStepProps> = ({
  amount,
  nextStep,
  onTokenSelect,
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
  const agaveTokens = useAgaveTokens()
  const market = useMarketsData().getMarket(tokenAddress)

  const onToggleWrap = (isToggled: boolean) => {
    onTokenSelect(isToggled ? agaveTokens.wrapperToken : agaveTokens.nativeToken)
  }

  const isNativeRelated = tokenInfo.extensions.isNative || tokenInfo.extensions.isNativeWrapper

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
    toggles: isNativeRelated ? (
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
    ) : null,
  }

  return (
    <Stepper {...wizardProps}>
      <TokenInput
        decimals={tokenInfo.decimals}
        maxValue={balance.toString()}
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
          Deposit
        </Button>
        <StepActionButton onClick={openMinHealthConfigurationModal}>
          Min health factor configuration
        </StepActionButton>
      </ButtonWrapper>
    </Stepper>
  )
}

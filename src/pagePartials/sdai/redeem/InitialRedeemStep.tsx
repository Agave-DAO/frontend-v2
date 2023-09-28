import { Dispatch, SetStateAction } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { Button, ButtonWrapper, Row, RowKey, RowValue } from '@/src/components/common/StepsCard'
import { TabToggle } from '@/src/components/common/TabToggle'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { useRedeemStepInitial } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepInitial'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { NumberType } from '@/src/utils/format'
import { Token } from '@/types/token'

interface InitialRedeemStepInfoProps {
  amount: string
  maxToRedeem: BigNumber
  tokenAddress: string
  tokenInfo: TokenWithType
}

const InitialRedeemStepInfo: React.FC<InitialRedeemStepInfoProps> = ({
  maxToRedeem,
  tokenInfo,
}) => {
  return (
    <>
      <Row>
        <RowKey>Available to redeem</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
          <Amount
            decimals={tokenInfo.decimals}
            numberType={NumberType.TokenTx}
            symbol=""
            value={maxToRedeem}
          />
        </RowValue>
      </Row>
    </>
  )
}

interface InitialRedeemStepProps {
  amount: string
  nextStep: () => void
  onTokenSelect: (token: Token) => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export const InitialRedeemStep: React.FC<InitialRedeemStepProps> = ({
  amount,
  nextStep,
  onTokenSelect,
  setAmount,
  tokenAddress,
}) => {
  const {
    disableSubmit,
    maxToRedeem,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useRedeemStepInitial({ amount, tokenAddress })

  const market = useMarketsData().getMarket(tokenAddress)
  const agaveTokens = useAgaveTokens()
  const isNativeRelated = tokenInfo.extensions.isNative || tokenInfo.extensions.isNativeWrapper

  const onToggleWrap = (isToggled: boolean) => {
    onTokenSelect(isToggled ? agaveTokens.wrapperToken : agaveTokens.nativeToken)
  }

  const stepperProps = {
    info: (
      <InitialRedeemStepInfo
        amount={amount}
        maxToRedeem={maxToRedeem}
        tokenAddress={tokenAddress}
        tokenInfo={tokenInfo}
      />
    ),
    title: 'Amount to redeem',
    titleButton: { onClick: () => setAmount(maxToRedeem.toString()), text: 'Use max' },
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
    <Stepper {...stepperProps}>
      <TokenInput
        decimals={tokenInfo.decimals}
        maxValue={maxToRedeem.toString()}
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
          Redeem
        </Button>
      </ButtonWrapper>
    </Stepper>
  )
}

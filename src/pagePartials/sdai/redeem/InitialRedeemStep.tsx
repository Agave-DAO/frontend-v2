import { Dispatch, SetStateAction } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import {
  Button,
  ButtonWrapper,
  Row,
  RowKey,
  RowValue,
  Text,
} from '@/src/components/common/StepsCard'
import { TabToggle } from '@/src/components/common/TabToggle'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { Token } from '@/src/pagePartials/sdai/DepositRedeem'
import { useRedeemStepInitial } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemStepInitial'
import { NumberType } from '@/src/utils/format'

interface InitialRedeemStepInfoProps {
  balance: BigNumber
  decimals: number
  symbol: string
}

const InitialRedeemStepInfo: React.FC<InitialRedeemStepInfoProps> = ({
  balance,
  decimals,
  symbol,
}) => {
  return (
    <>
      <Text>
        Need to bridge assets to Gnosis
        <br />
        from other chains? Consider using{' '}
        <a href="https://jumper.exchange/?fromChain=1&fromToken=0x6b175474e89094c44da98b954eedeac495271d0f&toChain=100&toToken=0x0000000000000000000000000000000000000000">
          jumper
        </a>
      </Text>
      <Row>
        <RowKey>Available to redeem</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={symbol} />
          <Amount decimals={decimals} numberType={NumberType.TokenTx} symbol="" value={balance} />
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
    balance,
    disableSubmit,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useRedeemStepInitial({ amount, tokenAddress })

  const onToggleWrap = (isToggled: boolean) => {
    const symbol = isToggled ? 'WXDAI' : 'XDAI'
    onTokenSelect(symbol)
  }

  const wizardProps = {
    info: (
      <InitialRedeemStepInfo
        balance={balance}
        decimals={tokenInfo.decimals}
        symbol={tokenInfo.symbol}
      />
    ),
    title: 'Amount to redeem',
    titleButton: {
      onClick: () => setAmount(balance.toString()),
      text: 'Use max',
    },
    toggles: (
      <TabToggle
        isToggled={true}
        onChange={onToggleWrap}
        toggleOptions={{
          toggledButton: 'WXDAI',
          toggledText: 'Wrapped token',
          untoggledButton: 'XDAI',
          untoggledText: 'Unwrapped token',
        }}
      />
    ),
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

import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { Swap } from '@/src/components/assets/Swap'
import {
  Rows as BaseRows,
  Button,
  ButtonWrapper,
  FormCard,
  Row,
  RowKey,
  RowValue,
} from '@/src/components/card/FormCard'
import { TitleWithAction } from '@/src/components/common/TitleWithAction'
import { DropdownDirection } from '@/src/components/dropdown/Dropdown'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInputDropdown } from '@/src/components/token/TokenInputDropdown'
import { Details } from '@/src/pagePartials/strategy/modals/common/Details'
import { Strategy } from '@/types/strategy'
import { Token } from '@/types/token'

const Rows = styled(BaseRows)`
  margin: 0 0 8px;
`

const RowKeyStrong = styled(RowKey)`
  font-size: 1.6rem;
  font-weight: 700;
`

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

const SwapSVG = styled(Swap)`
  path {
    fill: ${({ theme: { colors } }) => colors.darkerGray};
  }
`

const SendTokenInputDropdown = styled(TokenInputDropdown)``

const ReceiveTokenInputDropdown = styled(TokenInputDropdown)``

export const LongShort: React.FC<{ type: Strategy }> = withGenericSuspense(
  ({ type, ...restProps }) => {
    const [amountTokenValue, setSendTokenValue] = useState('0')
    const [sendAmountInputStatus, setAmountTokenInputStatus] = useState<TextfieldStatus>()
    const [sendAmountInputStatusText, setAmountTokenInputStatusText] = useState<
      string | undefined
    >()
    const [amountToken, setAmountToken] = useState<Token | null>({
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      decimals: 6,
      chainId: 100,
      logoURI: '/coins/usdc.svg',
      extensions: {
        isNative: false,
        isNativeWrapper: false,
      },
      type: 'reserve',
    })

    const onSendDropdownChange = (token: Token | null) => {
      setAmountToken(token)
    }

    const [receiveTokenValue, setReceiveTokenValue] = useState('0')
    const [receiveTokenInputStatus, setReceiveTokenInputStatus] = useState<TextfieldStatus>()
    const [receiveTokenInputStatusText, setReceiveTokenInputStatusText] = useState<
      string | undefined
    >()
    const [receiveToken, setReceiveToken] = useState<Token | null>({
      symbol: 'WXDAI',
      name: 'Wrapped XDAI',
      address: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
      decimals: 18,
      chainId: 100,
      logoURI: '/coins/wxdai.svg',
      extensions: {
        isNative: false,
        isNativeWrapper: true,
      },
      type: 'reserve',
    })

    const onReceiveDropdownChange = (token: Token | null) => {
      setReceiveToken(token)
      console.log('Receive token', token)
    }

    const [leverage, setLeverage] = useState('10')

    const onSubmit = useCallback(() => {
      console.log('Submit')
    }, [])

    return (
      <FormCard {...restProps}>
        <TitleWithAction
          button={{
            onClick: () => console.log('Use max'),
            text: 'Use max',
          }}
          title={`Amount`}
        />
        <Rows>
          <Row>
            <RowKey>Available</RowKey>
            <RowValue>
              {amountToken && <TokenIcon dimensions={18} symbol={amountToken?.symbol} />}
              1,000,000.00
            </RowValue>
          </Row>
        </Rows>
        <SendTokenInputDropdown
          decimals={18}
          dropdownDirection={DropdownDirection.downwards}
          maxValue={'10000'}
          onDropdownChange={onSendDropdownChange}
          selectedToken={amountToken}
          setStatus={() => console.log('amountToken setStatus')}
          setStatusText={() => console.log('amountToken setStatusText')}
          setValue={setSendTokenValue}
          status={sendAmountInputStatus}
          statusText={sendAmountInputStatusText}
          usdPrice={BigNumber.from('1000000000000000000')}
          value={amountTokenValue}
        />
        <hr />
        <Rows>
          <Row>
            <RowKeyStrong>{type === 'long' ? 'Long' : 'Short'}</RowKeyStrong>
            <RowValue>Leverage: {leverage}x</RowValue>
          </Row>
        </Rows>
        <ReceiveTokenInputDropdown
          decimals={18}
          maxValue={'10000'}
          onDropdownChange={onReceiveDropdownChange}
          selectedToken={receiveToken}
          setStatus={() => console.log('Receive setStatus')}
          setStatusText={() => console.log('Receive setStatusText')}
          setValue={setReceiveTokenValue}
          status={receiveTokenInputStatus}
          statusText={receiveTokenInputStatusText}
          usdPrice={BigNumber.from('1000000000000000000')}
          value={receiveTokenValue}
        />
        <Details
          data={[
            {
              key: 'Collateral In',
              value: amountToken?.symbol,
            },
            {
              key: 'Leverage',
              value: `${leverage}x`,
            },
            {
              key: 'Entry Price',
              value: '$1,066.86',
            },
            {
              key: 'Liq Price',
              value: '-',
            },
            {
              key: 'Fees',
              value: '-',
            },
          ]}
        />
        <Buttons>
          <Button onClick={onSubmit}>
            {type === 'long' ? 'Long' : 'Short'} {receiveToken?.symbol}
          </Button>
        </Buttons>
      </FormCard>
    )
  },
  () => <>Loading...</>,
)

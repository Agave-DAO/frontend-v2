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
import { SwapButton } from '@/src/pagePartials/strategy/modals/common/SwapButton'
import { Token } from '@/types/token'

const Rows = styled(BaseRows)`
  margin: 0 0 8px;
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

export const CollateralSwap: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const [sendTokenValue, setSendTokenValue] = useState('0')
    const [sendTokenInputStatus, setSendTokenInputStatus] = useState<TextfieldStatus>()
    const [sendTokenInputStatusText, setSendTokenInputStatusText] = useState<string | undefined>()
    const [sendToken, setSendToken] = useState<Token | null>({
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
      setSendToken(token)
      console.log('Send token', token)
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
          title={`Swap`}
        />
        <Rows>
          <Row>
            <RowKey>Balance</RowKey>
            <RowValue>
              {sendToken && <TokenIcon dimensions={18} symbol={sendToken?.symbol} />}
              1,000,000.00
            </RowValue>
          </Row>
        </Rows>
        <SendTokenInputDropdown
          decimals={18}
          dropdownDirection={DropdownDirection.downwards}
          maxValue={'10000'}
          onDropdownChange={onSendDropdownChange}
          selectedToken={sendToken}
          setStatus={() => console.log('sendToken setStatus')}
          setStatusText={() => console.log('sendToken setStatusText')}
          setValue={setSendTokenValue}
          status={sendTokenInputStatus}
          statusText={sendTokenInputStatusText}
          usdPrice={BigNumber.from('1000000000000000000')}
          value={sendTokenValue}
        />
        <SwapButton
          onClick={() => {
            console.log('Swap values')
          }}
        />
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
              key: 'Ref. price',
              value: (
                <>
                  1 {sendToken?.symbol} = 0.000034 {receiveToken?.symbol} <SwapSVG />
                </>
              ),
            },
            {
              key: 'Price Impact',
              value: '-1.23%',
            },
            {
              key: 'Network Fee',
              value: '0.30%',
            },
          ]}
        />
        <Buttons>
          <Button onClick={onSubmit}>Swap</Button>
        </Buttons>
      </FormCard>
    )
  },
  () => <>Loading...</>,
)

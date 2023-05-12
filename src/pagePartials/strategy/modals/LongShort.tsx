import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import {
  Button,
  ButtonWrapper,
  FormCard,
  Row,
  RowKey,
  RowValue,
} from '@/src/components/card/FormCard'
import { TitleWithAction } from '@/src/components/common/TitleWithAction'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInputDropdown } from '@/src/components/token/TokenInputDropdown'
import { Token } from '@/types/token'

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

export const LongShort: React.FC = withGenericSuspense(
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
        <Row>
          <RowKey>Balance</RowKey>
          <RowValue>
            {sendToken && <TokenIcon dimensions={18} symbol={sendToken?.symbol} />}
            1,000,000.00
          </RowValue>
        </Row>
        <TokenInputDropdown
          decimals={18}
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
        <Buttons>
          <Button onClick={onSubmit}>LongShort</Button>
        </Buttons>
      </FormCard>
    )
  },
  () => <>Loading...</>,
)

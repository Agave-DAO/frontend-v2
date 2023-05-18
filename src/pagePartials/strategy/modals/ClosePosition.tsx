import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { Row, RowKey, RowValue, Rows } from '@/src/components/common/Rows'
import { TitleWithAction } from '@/src/components/common/TitleWithAction'
import { DropdownDirection } from '@/src/components/dropdown/Dropdown'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { TokenDropdown } from '@/src/components/token/TokenDropdown'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInputDropdown } from '@/src/components/token/TokenInputDropdown'
import { Token } from '@/types/token'

const PositionTokenDropdownWrapper = styled.div`
  margin-bottom: 40px;
  position: relative;
`

const Title = styled.span`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 400;
  left: 71px;
  line-height: 1.2;
  position: absolute;
  top: 5px;
  white-space: nowrap;
  z-index: 5;
`

const PositionTokenDropdown = styled(TokenDropdown)`
  position: relative;
  z-index: 10;

  .dropdownButton {
    margin: 25px 0 0 0;
  }
`

const Form = styled(FormCard)`
  margin-bottom: 24px;
`

const TitleText = styled.span`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

export const ClosePosition: React.FC<ModalProps> = withGenericSuspense(
  ({ onClose, ...restProps }) => {
    const balance = '1,000,000.00'
    const [positionToken, setPositionToken] = useState<Token | null>({
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      address: '0x8e5bbbb09ed1ebde8674cda39a0c169401db4252',
      decimals: 8,
      chainId: 100,
      logoURI: '/coins/wbtc.svg',
      extensions: {
        isNative: false,
        isNativeWrapper: false,
        protocolTokens: {
          ag: '0x4863cfaf3392f20531aa72ce19e5783f489817d6',
          variableDebt: '0x110c5a1494f0ab6c851abb72aa2efa3da738ab72',
          stableDebt: '0xca0f3b157165fe11692a047ea14963ffadfb31fd',
        },
      },
      type: 'reserve',
    })

    const onPositionTokenChange = (token: Token | null) => {
      setPositionToken(token)
      console.log(token)
    }

    const [value, setValue] = useState('0')
    const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
    const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()
    const [token, setToken] = useState<Token | null>({
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

    const onTokenInputDropdownChange = (token: Token | null) => {
      setToken(token)
    }

    const closePosition = useCallback(() => {
      onClose()
    }, [onClose])

    return (
      <Modal onClose={onClose} {...restProps}>
        <PositionTokenDropdownWrapper>
          <Title>Close Long Position</Title>
          <PositionTokenDropdown
            activeTokenSymbol={positionToken?.symbol}
            onChange={onPositionTokenChange}
          />
        </PositionTokenDropdownWrapper>
        <Form>
          <TitleWithAction
            button={{
              onClick: () => console.log('click'),
              text: 'Use max',
            }}
            title={<TitleText>Max: ${balance}</TitleText>}
          />
          <TokenInputDropdown
            decimals={18}
            dropdownDirection={DropdownDirection.downwards}
            maxValue={'10000'}
            onDropdownChange={onTokenInputDropdownChange}
            selectedToken={token}
            setStatus={() => console.log('setStatus')}
            setStatusText={() => console.log('setStatusText')}
            setValue={setValue}
            status={tokenInputStatus}
            statusText={tokenInputStatusText}
            usdPrice={BigNumber.from('1000000000000000000')}
            value={value}
          />
          <Buttons>
            <Button onClick={closePosition}>Confirm</Button>
          </Buttons>
        </Form>
        <Rows>
          <Row variant="dark">
            <RowKey>Mark Price</RowKey>
            <RowValue>$15.84</RowValue>
          </Row>
          <Row>
            <RowKey>Entry Price</RowKey>
            <RowValue>$16.54</RowValue>
          </Row>
          <Row variant="dark">
            <RowKey>Liq. Price</RowKey>
            <RowValue>$18.09</RowValue>
          </Row>
          <Row>
            <RowKey>Size</RowKey>
            <RowValue>$734.77</RowValue>
          </Row>
          <Row variant="dark">
            <RowKey>Collateral</RowKey>
            <RowValue>$76.6213</RowValue>
          </Row>
          <Row>
            <RowKey>PnL</RowKey>
            <RowValue>+30.90 (+40.33%)</RowValue>
          </Row>
          <Row variant="dark">
            <RowKey>Fee</RowKey>
            <RowValue>$0.93</RowValue>
          </Row>
          <Row>
            <RowKey>Receive</RowKey>
            <RowValue>
              <TokenIcon symbol="usdc" />
              70.4620 USDC ($70.46)
            </RowValue>
          </Row>
        </Rows>
      </Modal>
    )
  },
  () => <>Loading...</>,
)

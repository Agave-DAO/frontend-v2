import React, { useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

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
import { Details as BaseDetails } from '@/src/pagePartials/strategy/modals/common/Details'
import { Strategy } from '@/types/strategy'
import { Token } from '@/types/token'

const Add: React.FC = () => (
  <svg fill="none" height="13" viewBox="0 0 13 13" width="13" xmlns="http://www.w3.org/2000/svg">
    <rect
      fill="#019D8B"
      height="12"
      rx="1"
      transform="rotate(90 12.5 5.5)"
      width="2"
      x="12.5"
      y="5.5"
    />
    <rect
      fill="#019D8B"
      height="12"
      rx="1"
      transform="rotate(-180 7.5 12.5)"
      width="2"
      x="7.5"
      y="12.5"
    />
  </svg>
)

const Substract: React.FC = () => (
  <svg fill="none" height="3" viewBox="0 0 13 3" width="13" xmlns="http://www.w3.org/2000/svg">
    <rect
      fill="#019D8B"
      height="12"
      rx="1"
      transform="rotate(90 12.5 0.499939)"
      width="2"
      x="12.5"
      y="0.499939"
    />
  </svg>
)

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

const SendTokenInputDropdown = styled(TokenInputDropdown)``

const ReceiveTokenInputDropdown = styled(TokenInputDropdown)``

const Line = styled.div`
  background-color: ${({ theme: { colors } }) => colors.lighterGray};
  height: 1px;
  margin: 24px calc(var(--padding-sm) * -1) 16px;
  width: calc(100% + var(--padding-sm) * 2);
`

const AdjustLeverage = styled.div`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.lighterGray50};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 24px calc(var(--padding-sm) * -1) 0;
  padding: var(--padding-xxxl) var(--padding-sm);
  width: calc(100% + var(--padding-sm) * 2);
`

const AdjustLeverageTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 400;
  margin: 0 0 16px;
  text-align: center;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 24px;
  }
`

const AdjustLeverageControls = styled.div`
  --controls-height: 57px;
  --controls-border-radius: 16px;
  --controls-background-color: ${({ theme: { colors } }) => colors.lighterGray};

  align-items: center;
  column-gap: 8px;
  display: grid;
  justify-content: center;
  margin: 0 0 32px;
  grid-template-columns: var(--controls-height) 1fr var(--controls-height);
  width: 100%;
`

const AdjustLeverageControl = styled.button`
  align-items: center;
  background: var(--controls-background-color);
  border-radius: var(--controls-border-radius);
  border: none;
  cursor: pointer;
  display: flex;
  height: var(--controls-height);
  justify-content: center;
  padding: 0;
  width: var(--controls-height);

  &:active {
    opacity: 0.7;
  }
`

const AdjustLeverageValue = styled.div`
  align-items: center;
  background: var(--controls-background-color);
  border-radius: var(--controls-border-radius);
  color: ${({ theme: { colors } }) => colors.darkestGray};
  display: flex;
  font-size: 1.8rem;
  font-weight: 700;
  height: var(--controls-height);
  justify-content: center;
  line-height: 1.2;
`

const LeverageMultipliers = styled.div`
  --values-height: 21px;
  --value-size: 15px;

  height: var(--values-height);
  margin: 0 var(--value-size);
  position: relative;
  width: calc(100% - var(--value-size));
`

const CURRENT_STEP_X = [
  0, 8.33, 16.66, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
]
const X2 = 0
const X5 = 3
const X10 = 8
const X15 = 13
const X20 = 18

const LeverageMultiplier = styled.div<{ currentLeverageX: number }>`
  background-color: ${({ theme: { colors } }) => colors.primary};
  border-radius: 50%;
  border: 2px solid #fff;
  height: var(--values-height);
  left: calc(
    ${({ currentLeverageX }) => CURRENT_STEP_X[currentLeverageX]}% - var(--values-height) / 2
  );
  position: absolute;
  top: calc(var(--values-height) / 2 - var(--values-height) / 2);
  transition: left 0.2s ease-in-out;
  width: var(--values-height);
  z-index: 10;
`

const LeverageMultipliersBackground = styled.div<{ currentLeverageX: number }>`
  background-color: ${({ theme: { colors } }) => colors.lightGray};
  height: 4px;
  left: 0;
  position: absolute;
  top: calc(var(--values-height) / 2 - 2px / 2);
  width: 100%;
  z-index: 1;

  &::before {
    background-color: ${({ theme: { colors } }) => colors.primary};
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: calc(
      ${({ currentLeverageX }) => CURRENT_STEP_X[currentLeverageX]}% - var(--values-height) / 2
    );
    transition: width 0.2s ease-in-out;
  }
`

const LeverageMainMultiplier = styled.div`
  position: absolute;
  top: calc(var(--values-height) / 2 - var(--value-size) / 2);
  z-index: 5;

  &.value_0 {
    left: calc(${CURRENT_STEP_X[X2]}% - var(--value-size) / 2);
  }

  &.value_1 {
    left: calc(${CURRENT_STEP_X[X5]}% - var(--value-size) / 2);
  }

  &.value_2 {
    left: calc(${CURRENT_STEP_X[X10]}% - var(--value-size) / 2);
  }

  &.value_3 {
    left: calc(${CURRENT_STEP_X[X15]}% - var(--value-size) / 2);
  }

  &.value_4 {
    left: calc(${CURRENT_STEP_X[X20]}% - var(--value-size) / 2);
  }
`

const MainMultiplierDot = styled.div<{ isActive?: boolean }>`
  background-color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.primary : colors.lightGray};
  border-radius: 50%;
  cursor: pointer;
  height: var(--value-size);
  transition: background-color 0.2s ease-in-out;
  width: var(--value-size);
`

const MainMultiplierText = styled.div`
  color: ${({ theme: { colors } }) => colors.darkerGray};
  font-size: 1.2rem;
  font-weight: 400;
  left: 50%;
  line-height: 1.2;
  position: absolute;
  top: calc(var(--value-size) + 4px);
  transform: translateX(-50%);
`

const Details = styled(BaseDetails)`
  padding-top: 24px;
`

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
    }

    const leverageSteps = useMemo(
      () => [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [],
    )
    const leverageMainMultipliers = [
      leverageSteps[X2],
      leverageSteps[X5],
      leverageSteps[X10],
      leverageSteps[X15],
      leverageSteps[X20],
    ]
    const [leverageIndex, setLeverageIndex] = useState(leverageSteps[X10])

    const nextStep = useCallback(() => {
      if (leverageIndex < leverageSteps.length - 1) {
        setLeverageIndex(leverageIndex + 1)
      }
    }, [leverageIndex, leverageSteps])

    const previousStep = useCallback(() => {
      if (leverageIndex > 0) {
        setLeverageIndex(leverageIndex - 1)
      }
    }, [leverageIndex])

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
        <Line />
        <Rows>
          <Row>
            <RowKeyStrong>{type === 'long' ? 'Long' : 'Short'}</RowKeyStrong>
            <RowValue>Leverage: {leverageIndex}x</RowValue>
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
        <AdjustLeverage>
          <AdjustLeverageTitle>Adjust leverage</AdjustLeverageTitle>
          <AdjustLeverageControls>
            <AdjustLeverageControl onClick={previousStep}>
              <Substract />
            </AdjustLeverageControl>
            <AdjustLeverageValue>{leverageSteps[leverageIndex]}x</AdjustLeverageValue>
            <AdjustLeverageControl onClick={nextStep}>
              <Add />
            </AdjustLeverageControl>
          </AdjustLeverageControls>
          <LeverageMultipliers>
            <LeverageMultipliersBackground currentLeverageX={leverageIndex} />
            <LeverageMultiplier currentLeverageX={leverageIndex} />
            {leverageMainMultipliers.map((value, index) => (
              <LeverageMainMultiplier
                className={`value_${index}`}
                key={value}
                onClick={() => {
                  const index = leverageSteps.findIndex((step) => step === value)
                  setLeverageIndex(index)
                }}
              >
                <MainMultiplierDot isActive={value <= leverageSteps[leverageIndex]} />
                <MainMultiplierText>{value}x</MainMultiplierText>
              </LeverageMainMultiplier>
            ))}
          </LeverageMultipliers>
        </AdjustLeverage>
        <Details
          data={[
            {
              key: 'Collateral In',
              value: amountToken?.symbol,
            },
            {
              key: 'Leverage',
              value: `${leverageSteps[leverageIndex]}x`,
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

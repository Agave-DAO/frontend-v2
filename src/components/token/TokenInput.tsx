import { DOMAttributes, HTMLAttributes, useCallback, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { BigNumberInput } from 'big-number-input'
import { BigNumber } from 'ethers/lib/ethers'
import { formatUnits } from 'ethers/lib/utils'

import { Textfield as BaseTextField, TextfieldStatus } from '@/src/components/form/Textfield'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  row-gap: 6px;
  width: 100%;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Textfield: any = styled(BaseTextField)`
  padding-right: 40px;
  position: relative;
  width: 100%;
  z-index: 0;
`

const MaxButton = styled.button`
  background: none;
  border-radius: 3px;
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
  padding: 3px 5px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.15s linear;
  z-index: 5;

  &:active {
    opacity: 0.7;
  }
`

const CSSRight = css`
  right: var(--balance-horizontal-displacement);
`

const CSSLeft = css`
  left: var(--balance-horizontal-displacement);
`

const CSSTop = css`
  top: calc(100% + var(--balance-vertical-displacement));
`

const CSSBottom = css`
  bottom: calc(100% + var(--balance-vertical-displacement));
`

const CSSCenter = css`
  left: 0;
  right: 0;
  text-align: center;
`

const Balance = styled.div<{ balancePosition?: BalancePosition }>`
  --balance-horizontal-displacement: 3px;
  --balance-vertical-displacement: 6px;

  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.2;
  position: absolute;
  white-space: nowrap;

  ${({ balancePosition }) =>
    balancePosition === 'topLeft'
      ? css`
          ${CSSBottom}
          ${CSSLeft}
        `
      : balancePosition === 'bottomLeft'
      ? css`
          ${CSSLeft}
          ${CSSTop}
        `
      : balancePosition === 'topRight'
      ? css`
          ${CSSBottom}
          ${CSSRight}
        `
      : balancePosition === 'bottomRight'
      ? css`
          ${CSSRight}
          ${CSSTop}
        `
      : balancePosition === 'bottomCenter'
      ? css`
          ${CSSCenter}
          ${CSSTop}
        `
      : balancePosition === 'topCenter'
      ? css`
          ${CSSBottom}
          ${CSSCenter}
        `
      : css`
          ${CSSRight}
          ${CSSTop}
        `}
`

type BalancePosition =
  | 'bottomCenter'
  | 'bottomLeft'
  | 'bottomRight'
  | 'topCenter'
  | 'topLeft'
  | 'topRight'
  | undefined

interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  balancePosition?: BalancePosition
  decimals: number
  disabled?: boolean
  maxDisabled?: boolean
  maxValue: string
  setStatus: (status: TextfieldStatus | undefined) => void
  setStatusText: (statusText: string | undefined) => void
  setValue: (value: string) => void
  symbol?: string
  value: string
}

export const TokenInput = ({
  balancePosition,
  decimals,
  disabled,
  maxDisabled,
  maxValue,
  setStatus,
  setStatusText,
  setValue,
  symbol,
  value,
  ...restProps
}: Props) => {
  const maxValueFormatted = formatUnits(maxValue, decimals)
  const valueGreaterThanMaxValue = useMemo(
    () => (value && BigNumber.from(value).gt(maxValue) ? true : false),
    [maxValue, value],
  )

  const clearStatuses = useCallback(() => {
    setStatus(undefined)
    setStatusText(undefined)
  }, [setStatus, setStatusText])

  useEffect(() => {
    if (valueGreaterThanMaxValue) {
      setStatus(TextfieldStatus.error)
      setStatusText('Insufficient balance')
    } else {
      clearStatuses()
    }
  }, [clearStatuses, setStatus, setStatusText, valueGreaterThanMaxValue])

  return (
    <Wrapper {...restProps}>
      <Balance balancePosition={balancePosition}>
        Balance: {maxValueFormatted} {symbol ? symbol : 'tokens'}
      </Balance>
      <BigNumberInput
        decimals={decimals}
        onChange={(value) => {
          setValue(value)
        }}
        renderInput={(props) => (
          <Textfield
            disabled={disabled}
            min="0"
            placeholder="0.00"
            status={valueGreaterThanMaxValue ? TextfieldStatus.error : undefined}
            type="number"
            {...props}
          />
        )}
        value={value}
      />
      <MaxButton disabled={maxDisabled} onClick={() => setValue(maxValue)}>
        Max
      </MaxButton>
    </Wrapper>
  )
}

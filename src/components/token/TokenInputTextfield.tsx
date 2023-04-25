import { useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { BigNumberInput } from 'big-number-input'

import { TextfieldProps, TextfieldStatus } from '@/src/components/form/Textfield'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Textfield: any = styled.input<TextfieldProps>`
  background-color: transparent;
  border: none;
  color: ${({ theme: { colors } }) => colors.darkestGray};
  flex-grow: 1;
  font-size: 1.8rem;
  font-weight: 700;
  outline: none;
  padding: 0;

  &::placeholder {
    color: ${({ theme: { colors } }) => colors.gray};
  }
`

export interface Props {
  decimals: number
  disabled?: boolean
  maxValue: string
  setStatus: (status: TextfieldStatus | undefined) => void
  setStatusText: (statusText: string | undefined) => void
  setValue: (value: string) => void
  value: string
}

export const TokenInputTextfield: React.FC<Props> = ({
  decimals,
  disabled,
  maxValue,
  setStatus,
  setStatusText,
  setValue,
  value,
  ...restProps
}) => {
  const valueGreaterThanMaxValue = useMemo(
    () => !!(value && BigNumber.from(value).gt(maxValue)),
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
          {...restProps}
        />
      )}
      value={value}
    />
  )
}

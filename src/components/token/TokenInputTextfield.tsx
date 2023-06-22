import { useEffect, useMemo, useRef } from 'react'
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
  line-height: 1;
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
  // we know that these functions will remain unchanged during the current implementation
  const { current: setters } = useRef({ setStatus, setStatusText })

  const valueGreaterThanMaxValue = useMemo(
    () => !!(value && BigNumber.from(value).gt(maxValue)),
    [maxValue, value],
  )

  useEffect(() => {
    if (valueGreaterThanMaxValue) {
      setters.setStatus(TextfieldStatus.error)
      setters.setStatusText('Insufficient balance')
    } else {
      setters.setStatus(undefined)
      setters.setStatusText(undefined)
    }
  }, [setters, valueGreaterThanMaxValue])

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

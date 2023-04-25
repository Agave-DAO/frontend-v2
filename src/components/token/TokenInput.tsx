import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import debounce from 'lodash/debounce'

import { FormStatus as BaseFormStatus } from '@/src/components/form/FormStatus'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import {
  Props as TokenInputProps,
  TokenInputTextfield,
} from '@/src/components/token/TokenInputTextfield'
import { fromWei } from '@/src/utils/common'

const Wrapper = styled.div<{ status?: TextfieldStatus | undefined }>`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.lighterGray};
  border-radius: 16px;
  border: 1px solid ${({ theme: { colors } }) => colors.lighterGray};
  column-gap: 8px;
  display: flex;
  flex-direction: row;
  height: 57px;
  justify-content: space-between;
  padding: 16px;
  position: relative;
  width: 100%;

  ${({ status }) =>
    status === 'error' &&
    css`
      color: ${({ theme: { colors } }) => colors.error};
      border-color: ${({ theme: { colors } }) => colors.error};

      &::placeholder {
        color: ${({ theme: { colors } }) => colors.error};
      }
    `}
`

const USDValue = styled.div`
  margin-left: auto;
`

const FormStatus = styled(BaseFormStatus)`
  left: 49px;
  position: absolute;
  top: calc(100% - 17px);
`

interface Props extends TokenInputProps {
  status?: TextfieldStatus | undefined
  statusText?: string | undefined
  symbol: string
  delay?: number
  usdPrice?: BigNumber
}

export const TokenInput: React.FC<Props> = ({
  decimals,
  delay = 500,
  disabled,
  maxValue,
  setStatus,
  setStatusText,
  setValue,
  status,
  statusText,
  symbol,
  usdPrice,
  value,
  ...restProps
}) => {
  const [localValue, setLocalValue] = useState(value)

  const debouncedSetAmount = useMemo(
    () =>
      debounce((amount: string) => {
        setValue(amount)
      }, delay),
    [delay, setValue],
  )

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <Wrapper status={status} {...restProps}>
      <TokenIcon dimensions={25} symbol={symbol} />
      <TokenInputTextfield
        decimals={decimals}
        disabled={disabled}
        maxValue={maxValue}
        setStatus={setStatus}
        setStatusText={setStatusText}
        setValue={async (v) => {
          setLocalValue(v)
          debouncedSetAmount(v)
        }}
        value={localValue}
      />

      {usdPrice && (
        <USDValue>
          <Amount value={fromWei(usdPrice.mul(localValue || '0'), decimals)} />
        </USDValue>
      )}
      {statusText && <FormStatus status={status}>{statusText}</FormStatus>}
    </Wrapper>
  )
}

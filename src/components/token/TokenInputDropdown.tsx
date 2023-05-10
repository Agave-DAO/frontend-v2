import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import debounce from 'lodash/debounce'

import { FormStatus as BaseFormStatus } from '@/src/components/form/FormStatus'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenDropdownSearch } from '@/src/components/token/TokenDropdownSearch'
import {
  Props as TokenInputProps,
  TokenInputTextfield,
} from '@/src/components/token/TokenInputTextfield'
import { fromWei } from '@/src/utils/common'
import { Token } from '@/types/token'

const Wrapper = styled.div<{ status?: TextfieldStatus | undefined }>`
  --padding: 16px;
  --border-radius: 16px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.lighterGray};
  border-radius: var(--border-radius);
  border: 1px solid ${({ theme: { colors } }) => colors.lighterGray};
  column-gap: 8px;
  display: flex;
  flex-direction: row;
  height: 62px;
  justify-content: space-between;
  padding-left: var(--padding);
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

const ValueWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const USDValue = styled.div`
  color: ${({ theme: { colors } }) => colors.darkishGray};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1;
`

const Dropdown = styled(TokenDropdownSearch)<{ status?: TextfieldStatus | undefined }>`
  height: calc(100% + 2px);
  margin: 0 -1px 0 0;

  .dropdownButton {
    height: 100%;

    .button {
      background-color: ${({ theme: { colors } }) => colors.lightGrayUltra};
      border-bottom-left-radius: 0;
      border-bottom-right-radius: var(--border-radius);
      border-color: transparent;
      border-style: solid;
      border-top-left-radius: 0;
      border-top-right-radius: var(--border-radius);
      border-width: 1px;
      height: 100%;
      border-left: none;

      &:hover {
        background-color: ${({ theme: { colors } }) => colors.lightGray};
      }

      ${({ status }) =>
        status === 'error' &&
        css`
          border-color: ${({ theme: { colors } }) => colors.error};
          border-right-color: ${({ theme: { colors } }) => colors.error};
          border-top-color: ${({ theme: { colors } }) => colors.error};
        `}
    }
  }
`

const FormStatus = styled(BaseFormStatus)`
  left: var(--padding);
  position: absolute;
  top: calc(100% - 14px);
`

interface Props extends TokenInputProps {
  delay?: number
  onDropdownChange?: (token: Token | null) => void
  selectedToken?: Token | null
  status?: TextfieldStatus | undefined
  statusText?: string | undefined
  usdPrice?: BigNumber
}

export const TokenInputDropdown: React.FC<Props> = ({
  decimals,
  delay = 500,
  disabled,
  maxValue,
  onDropdownChange,
  selectedToken,
  setStatus,
  setStatusText,
  setValue,
  status,
  statusText,
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
      <ValueWrapper>
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
      </ValueWrapper>
      <Dropdown onChange={onDropdownChange} selectedToken={selectedToken} status={status} />
      {statusText && <FormStatus status={status}>{statusText}</FormStatus>}
    </Wrapper>
  )
}

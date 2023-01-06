import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { LabelAlt as Label } from '@/src/components/form/Label'

export interface Props {
  checked?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Wrapper = styled.span<{ disabled?: boolean }>`
  align-items: center;
  column-gap: 8px;
  display: flex;
  max-width: fit-content;

  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;
          opacity: 0.5;

          .label {
            cursor: not-allowed;
          }
        `
      : css`
          cursor: pointer;
        `}
`

const Radio = styled.span<Props>`
  background-color: ${({ checked, theme: { radioButton } }) =>
    checked ? radioButton.backgroundColorActive : radioButton.backgroundColor};
  border-color: ${({ theme: { radioButton } }) => radioButton.borderColor};
  border-radius: 50%;
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${({ theme: { radioButton } }) => radioButton.dimensions};
  transition: all 0.15s linear;
  width: ${({ theme: { radioButton } }) => radioButton.dimensions};
`

export const Radiobutton: React.FC<PropsWithChildren<Props>> = ({
  checked,
  children,
  disabled,
  onClick,
  ...restProps
}) => {
  return (
    <Wrapper
      disabled={disabled}
      onClick={() => {
        if (disabled) return

        if (typeof onClick !== 'undefined') {
          onClick()
        }
      }}
      {...restProps}
    >
      <Radio checked={checked} />
      {children && <Label>{children}</Label>}
    </Wrapper>
  )
}

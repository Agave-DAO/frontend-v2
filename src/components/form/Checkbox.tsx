import { PropsWithChildren, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'

import { LabelAlt as Label } from '@/src/components/form/Label'

export interface Props {
  checked?: boolean
  disabled?: boolean
  onClick?: (checked: boolean) => void
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

const Checkmark = styled.span<Props>`
  background-color: ${({ checked, theme: { checkBox } }) =>
    checked ? checkBox.backgroundColorActive : checkBox.backgroundColor};
  border-color: ${({ theme: { checkBox } }) => checkBox.borderColor};
  border-style: solid;
  border-width: 1px;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${({ theme: { checkBox } }) => checkBox.dimensions};
  transition: all 0.15s linear;
  width: ${({ theme: { checkBox } }) => checkBox.dimensions};
`

export const Checkbox: React.FC<PropsWithChildren<Props>> = ({
  checked = false,
  children,
  disabled,
  onClick,
  ...restProps
}) => {
  const [isActive, setIsActive] = useState(checked)

  const onCheckboxClick = useCallback(() => {
    if (disabled) return

    setIsActive(!isActive)

    if (typeof onClick !== 'undefined') {
      onClick(!isActive)
    }
  }, [disabled, isActive, onClick])

  return (
    <Wrapper disabled={disabled} onClick={onCheckboxClick} {...restProps}>
      <Checkmark checked={isActive} />
      {children && <Label>{children}</Label>}
    </Wrapper>
  )
}

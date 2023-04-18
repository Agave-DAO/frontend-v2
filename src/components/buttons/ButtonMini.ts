import styled from 'styled-components'

import { ActiveButtonCSS, DisabledButtonCSS } from '@/src/components/buttons/Button'

export const ButtonMini = styled.button<{ variant?: 'dark' | 'regular' | 'danger' | undefined }>`
  align-items: center;
  background-color: ${({ theme: { buttonMini }, variant }) =>
    variant === 'dark'
      ? buttonMini.dark.backgroundColor
      : variant === 'danger'
      ? buttonMini.danger.backgroundColor
      : buttonMini.regular.backgroundColor};
  border-radius: 20px;
  border: none;
  color: ${({ theme: { buttonMini } }) => buttonMini.color};
  cursor: pointer;
  display: flex;
  display: flex;
  flex-grow: 0;
  font-family: ${({ theme: { fonts } }) => fonts.family};
  font-size: 1.4rem;
  font-weight: 400;
  height: 28px;
  padding: 0 8px;
  transition: all 0.15s ease-out;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
    height: 30px;
    padding: 0 16px;
  }

  &:active {
    opacity: 0.7;
  }

  &:hover {
    color: ${({ theme: { buttonMini } }) => buttonMini.colorHover};
    background-color: ${({ theme: { buttonMini }, variant }) =>
      variant === 'dark'
        ? buttonMini.dark.backgroundColorHover
        : variant === 'danger'
        ? buttonMini.danger.backgroundColorHover
        : buttonMini.regular.backgroundColorHover};
  }

  ${ActiveButtonCSS}
  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { buttonMini } }) => buttonMini.backgroundColor};
    color: ${({ theme: { buttonMini } }) => buttonMini.color};
  }
`

ButtonMini.defaultProps = {
  variant: 'regular',
}

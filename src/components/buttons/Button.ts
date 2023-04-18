import styled, { css } from 'styled-components'

export const DisabledButtonCSS = css`
  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const ActiveButtonCSS = css`
  &:active {
    opacity: 0.7;
  }
`

export interface ButtonProps {
  borderRadiusVariant?: 'fullyRounded' | 'round' | 'square'
}

export const ButtonCSS = css<ButtonProps>`
  align-items: center;
  border-style: solid;
  border-width: 1px;
  column-gap: 10px;
  cursor: pointer;
  display: flex;
  font-family: ${({ theme: { fonts } }) => fonts.family};
  font-size: 1.6rem;
  font-weight: 400;
  height: 38px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 0 18px;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s ease-out;
  user-select: none;
  white-space: nowrap;

  ${({ borderRadiusVariant }) =>
    borderRadiusVariant === 'fullyRounded'
      ? css`
          border-radius: 20px;
        `
      : borderRadiusVariant === 'round'
      ? css`
          border-radius: 8px;
        `
      : borderRadiusVariant === 'square'
      ? css`
          border-radius: 0;
        `
      : ''}

  ${ActiveButtonCSS}
`

export const buttonVariantCSS = (type: {
  backgroundColor: string
  backgroundColorHover: string
  borderColor: string
  borderColorHover: string
  color: string
  colorHover: string
}) => css`
  background-color: ${type.backgroundColor};
  border-color: ${type.borderColor};
  color: ${type.color};

  &:hover {
    background-color: ${type.backgroundColorHover};
    border-color: ${type.borderColorHover};
    color: ${type.colorHover};
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-color: ${type.backgroundColor};
    border-color: ${type.borderColor};
    color: ${type.color};
  }
`

export const BaseButton = styled.button<ButtonProps>`
  ${ButtonCSS}
  ${DisabledButtonCSS}
`

BaseButton.defaultProps = {
  borderRadiusVariant: 'fullyRounded',
  type: 'button',
}

export const ButtonPrimary = styled(BaseButton)`
  ${({ theme: { buttonPrimary } }) => buttonVariantCSS(buttonPrimary)}
`

export const ButtonPrimaryDark = styled(BaseButton)`
  ${({ theme: { buttonPrimaryDark } }) => buttonVariantCSS(buttonPrimaryDark)}
`

export const ButtonDark = styled(BaseButton)`
  ${({ theme: { buttonDark } }) => buttonVariantCSS(buttonDark)}
`

export const ButtonLight = styled(BaseButton)`
  ${({ theme: { buttonLight } }) => buttonVariantCSS(buttonLight)}
`

export const ButtonUltraLight = styled(BaseButton)`
  ${({ theme: { buttonUltraLight } }) => buttonVariantCSS(buttonUltraLight)}
`

export const ButtonNeutral = styled(BaseButton)`
  ${({ theme: { buttonNeutral } }) => buttonVariantCSS(buttonNeutral)}
`

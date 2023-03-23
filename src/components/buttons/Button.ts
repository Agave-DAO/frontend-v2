import styled, { css } from 'styled-components'

import { ThemeType } from '@/src/theme/types'

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

interface ButtonProps {
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

const BaseButton = styled.button<ButtonProps>`
  ${ButtonCSS}
`

BaseButton.defaultProps = {
  borderRadiusVariant: 'fullyRounded',
  type: 'button',
}

export const Button = styled(BaseButton)`
  ${DisabledButtonCSS}
`

export const ButtonPrimaryCSS = css`
  background-color: ${({ theme: { buttonPrimary } }) => buttonPrimary.backgroundColor};
  border-color: ${({ theme: { buttonPrimary } }) => buttonPrimary.borderColor};
  color: ${({ theme: { buttonPrimary } }) => buttonPrimary.color};

  &:hover {
    background-color: ${({ theme: { buttonPrimary } }) => buttonPrimary.backgroundColorHover};
    border-color: ${({ theme: { buttonPrimary } }) => buttonPrimary.borderColorHover};
    color: ${({ theme: { buttonPrimary } }) => buttonPrimary.colorHover};
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { buttonPrimary } }) => buttonPrimary.backgroundColor};
    border-color: ${({ theme: { buttonPrimary } }) => buttonPrimary.borderColor};
    color: ${({ theme: { buttonPrimary } }) => buttonPrimary.color};
  }
`

export const ButtonPrimary = styled(BaseButton)`
  ${ButtonPrimaryCSS}
`

ButtonPrimary.defaultProps = {
  borderRadiusVariant: 'fullyRounded',
}

export const ButtonGradientCSS = css`
  background-image: ${({ theme: { buttonGradient } }) => buttonGradient.backgroundImage};
  border: none;
  color: ${({ theme: { buttonGradient } }) => buttonGradient.color};

  &:hover {
    background-image: ${({ theme: { buttonGradient } }) => buttonGradient.backgroundImageHover};
    color: ${({ theme: { buttonGradient } }) => buttonGradient.colorHover};
    opacity: 0.8;
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-image: ${({ theme: { buttonGradient } }) => buttonGradient.backgroundImage};
    color: ${({ theme: { buttonGradient } }) => buttonGradient.color};
  }
`

export const ButtonGradient = styled(BaseButton)`
  ${ButtonGradientCSS}
`

ButtonGradient.defaultProps = {
  borderRadiusVariant: 'fullyRounded',
}

export const ButtonConnect = styled(ButtonGradient)`
  font-size: 1.6rem;
  font-weight: 700;
  height: 54px;

  color: ${({ theme: { buttonConnect } }) => buttonConnect.color};

  &:hover {
    color: ${({ theme: { buttonConnect } }) => buttonConnect.colorHover};
  }
`

ButtonConnect.defaultProps = {
  borderRadiusVariant: 'round',
}

export const ButtonPrimaryDarkCSS = css`
  background-color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.backgroundColor};
  border-color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.borderColor};
  color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.color};

  &:hover {
    background-color: ${({ theme: { buttonPrimaryDark } }) =>
      buttonPrimaryDark.backgroundColorHover};
    border-color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.borderColorHover};
    color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.colorHover};
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.backgroundColor};
    border-color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.borderColor};
    color: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.color};
  }
`

export const ButtonPrimaryDark = styled(BaseButton)`
  ${ButtonPrimaryDarkCSS}
`

export const ButtonDarkCSS = css`
  background-color: ${({ theme: { buttonDark } }) => buttonDark.backgroundColor};
  border-color: ${({ theme: { buttonDark } }) => buttonDark.borderColor};
  color: ${({ theme: { buttonDark } }) => buttonDark.color};

  &:hover {
    background-color: ${({ theme: { buttonDark } }) => buttonDark.backgroundColorHover};
    border-color: ${({ theme: { buttonDark } }) => buttonDark.borderColorHover};
    color: ${({ theme: { buttonDark } }) => buttonDark.colorHover};
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { buttonDark } }) => buttonDark.backgroundColor};
    border-color: ${({ theme: { buttonDark } }) => buttonDark.borderColor};
    color: ${({ theme: { buttonDark } }) => buttonDark.color};
  }
`

export const ButtonDark = styled(BaseButton)`
  ${ButtonDarkCSS}
`

export const ButtonLightCSS = css`
  background-color: ${({ theme: { buttonLight } }) => buttonLight.backgroundColor};
  border-color: ${({ theme: { buttonLight } }) => buttonLight.borderColor};
  color: ${({ theme: { buttonLight } }) => buttonLight.color};

  &:hover {
    background-color: ${({ theme: { buttonLight } }) => buttonLight.backgroundColorHover};
    border-color: ${({ theme: { buttonLight } }) => buttonLight.borderColorHover};
    color: ${({ theme: { buttonLight } }) => buttonLight.colorHover};
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { buttonLight } }) => buttonLight.backgroundColor};
    border-color: ${({ theme: { buttonLight } }) => buttonLight.borderColor};
    color: ${({ theme: { buttonLight } }) => buttonLight.color};
  }
`

export const ButtonLight = styled(BaseButton)`
  ${ButtonLightCSS}
`

export const ButtonNeutralCSS = css`
  background-color: ${({ theme: { buttonNeutral } }) => buttonNeutral.backgroundColor};
  border-color: ${({ theme: { buttonNeutral } }) => buttonNeutral.borderColor};
  color: ${({ theme: { buttonNeutral } }) => buttonNeutral.color};

  &:hover {
    background-color: ${({ theme: { buttonNeutral } }) => buttonNeutral.backgroundColorHover};
    border-color: ${({ theme: { buttonNeutral } }) => buttonNeutral.borderColorHover};
    color: ${({ theme: { buttonNeutral } }) => buttonNeutral.colorHover};
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { buttonNeutral } }) => buttonNeutral.backgroundColor};
    border-color: ${({ theme: { buttonNeutral } }) => buttonNeutral.borderColor};
    color: ${({ theme: { buttonNeutral } }) => buttonNeutral.color};
  }
`

export const ButtonNeutral = styled(BaseButton)`
  ${ButtonNeutralCSS}
`

export const ButtonDropdownIsOpenCSS = css`
  &::after {
    transform: rotate(180deg);
  }
`

export const ButtonDropdownCSS = css<{ currentThemeName?: ThemeType }>`
  background-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.backgroundColor};
  border-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.borderColor};
  color: ${({ theme: { buttonDropdown } }) => buttonDropdown.color};

  &:hover {
    background-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.backgroundColorHover};
    border-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.borderColorHover};
    color: ${({ theme: { buttonDropdown } }) => buttonDropdown.colorHover};
  }

  &::after {
    --dimensions: 8px;

    background-position: 50% 50%;
    background-repeat: no-repeat;
    color: ${({ theme: { buttonDropdown } }) => buttonDropdown.color};
    content: '';
    flex-shrink: 0;
    gap: 10px;
    height: var(--dimensions);
    width: var(--dimensions);

    ${({ currentThemeName }) =>
      currentThemeName === 'dark'
        ? css`
            background-image: url('data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00IDZMLjUzNiAwaDYuOTI4TDQgNnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=');
          `
        : css`
            background-image: url('data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik00IDZMLjUzNiAwaDYuOTI4TDQgNnoiIGZpbGw9IiM2NjYiLz48L3N2Zz4=');
          `}
  }

  .isOpen & {
    ${ButtonDropdownIsOpenCSS}
    ${DisabledButtonCSS}

    &:active {
      opacity: 1;
    }

    &[disabled],
    &[disabled]:hover {
      background-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.borderColor};
      border-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.borderColor};
    }
  }
`
export const ButtonDropdown = styled(Button)<{ currentThemeName?: ThemeType }>`
  ${ButtonDropdownCSS}
`

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

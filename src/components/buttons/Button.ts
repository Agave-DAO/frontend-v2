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

export const ButtonCSS = css`
  align-items: center;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  column-gap: 10px;
  cursor: pointer;
  display: flex;
  font-family: ${({ theme: { fonts } }) => fonts.family};
  font-size: 1.4rem;
  font-weight: 500;
  height: 34px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 0 12px;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s ease-out;
  user-select: none;
  white-space: nowrap;

  ${ActiveButtonCSS}
`

const BaseButton = styled.button`
  ${ButtonCSS}
`

BaseButton.defaultProps = {
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

    content: '';

    background-position: 50% 50%;
    background-repeat: no-repeat;
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
  }

  ${DisabledButtonCSS}

  &:active {
    opacity: 1;
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.borderColor};
    border-color: ${({ theme: { buttonDropdown } }) => buttonDropdown.borderColor};
    color: ${({ theme: { buttonDropdown } }) => buttonDropdown.color};
  }
`

export const ButtonDropdown = styled(Button)<{ currentThemeName?: ThemeType }>`
  ${ButtonDropdownCSS}
`

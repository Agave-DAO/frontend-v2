import styled, { css } from 'styled-components'

import { Dropdown as BaseDropdown } from '@/src/components/common/Dropdown'

export const NavLinkCSS = css`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 0 8px;

  &:active {
    opacity: 0.7;
  }

  &.active {
    background-color: ${({ theme: { colors } }) => colors.darkererGreen};
  }
`

export const Dropdown = styled(BaseDropdown)`
  height: 100%;

  .dropdownButton {
    ${NavLinkCSS}
  }

  &.isOpen .dropdownButton {
    background-color: ${({ theme: { colors } }) => colors.darkererGreen};
  }

  .dropdownItems {
    --border-radius: 4px;

    background-color: ${({ theme: { colors } }) => colors.darkererGreen};
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border: none;
    padding: 0;
    top: 100%;
  }
`

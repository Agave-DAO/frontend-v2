import { css } from 'styled-components'

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

import styled, { css } from 'styled-components'

import { NavLink } from '@/src/components/navigation/NavLink'

export const Tabs = styled.div`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.mainDark3};
  border-radius: 60px;
  box-shadow: 0 51px 80px rgba(0, 0, 0, 0.17), 0px 19.6444px 25.4815px rgba(0, 0, 0, 0.103259),
    0 4.15556px 6.51852px rgba(0, 0, 0, 0.0667407);
  column-gap: 8px;
  display: flex;
  justify-content: center;
  max-width: fit-content;
  padding: 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    padding: 16px;
  }
`

const TabCSS = css`
  align-items: center;
  background-color: transparent;
  border-radius: 20px;
  border: none;
  color: ${({ theme: { colors } }) => colors.textColor};
  cursor: pointer;
  display: flex;
  font-family: ${({ theme: { fonts } }) => fonts.family};
  font-size: 1.6rem;
  font-weight: 400;
  height: 38px;
  justify-content: center;
  padding: 0 16px;
  text-decoration: none;
  transition: all 0.15s linear;
  user-select: none;

  &:active {
    opacity: 0.8;
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.8rem;
    height: 57px;
    padding: 0 24px;
    border-radius: 60px;
  }
`

const ActiveTabCSS = css`
  background: #fff;
  color: ${({ theme: { colors } }) => colors.primary};
  pointer-events: none;
`

const DisabledTabCSS = css`
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }
`

export const TabLink = styled(NavLink)`
  ${TabCSS}

  &.active {
    ${ActiveTabCSS}
  }
`

export const Tab = styled.button<{ isActive?: boolean; disabled?: boolean }>`
  ${TabCSS}

  ${({ isActive }) => isActive && ActiveTabCSS}

  ${({ disabled }) => disabled && DisabledTabCSS}
`

Tab.defaultProps = {
  isActive: false,
}

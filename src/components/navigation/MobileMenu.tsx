import { DOMAttributes } from 'react'
import styled from 'styled-components'

import { ContainerPadding } from '@/src/components/helpers/ContainerPadding'
import { NavLink as BaseNavLink } from '@/src/components/navigation/NavLink'
import { sections } from '@/src/constants/menu'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.modal.overlayColor};
  bottom: 0;
  left: 0;
  position: fixed;
  top: ${({ theme }) => theme.header.height};
  width: 100vw;
  z-index: 5;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

const Menu = styled.nav`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

const NavLink = styled(BaseNavLink)`
  align-items: center;
  background-color: ${({ theme }) => theme.mobileMenu.backgroundColor};
  border-bottom: 1px solid ${({ theme }) => theme.mobileMenu.borderColor};
  color: ${({ theme }) => theme.mobileMenu.color};
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  gap: 10px;
  line-height: 1.2;
  min-height: 42px;
  text-decoration: none;
  user-select: none;
  width: 100%;

  ${ContainerPadding}

  &.active {
    font-weight: 700;
  }

  &:active {
    opacity: 0.7;
  }

  &:last-child {
    border-bottom: none;
  }
`

export const MobileMenu: React.FC<DOMAttributes<HTMLDivElement>> = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Menu>
        {sections.map(({ href, section }) => {
          return (
            <NavLink href={href} key={`mobile_menu_item_${section}`}>
              {section}
            </NavLink>
          )
        })}
      </Menu>
    </Wrapper>
  )
}

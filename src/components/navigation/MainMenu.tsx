import styled from 'styled-components'

import { NavLink as BaseNavLink } from '@/src/components/navigation/NavLink'
import { sections } from '@/src/constants/menu'

const Wrapper = styled.nav`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    align-items: center;
    display: flex;
    gap: 20px;
    margin-left: 20px;
  }
`

const NavLink = styled(BaseNavLink)`
  align-items: center;
  color: ${({ theme }) => theme.mainMenu.color};
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  gap: 8px;
  line-height: 1.2;
  text-decoration: none;

  &.active {
    font-weight: 700;
  }

  &:hover {
    text-decoration: underline;
  }
`

export const MainMenu: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {sections.map(({ href, section }) => {
        return (
          <NavLink href={href} key={`main_menu_item_${section}`}>
            {section}
          </NavLink>
        )
      })}
    </Wrapper>
  )
}

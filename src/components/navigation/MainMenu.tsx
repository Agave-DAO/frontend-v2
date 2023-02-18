import styled from 'styled-components'

import { NavLink as BaseNavLink } from '@/src/components/navigation/NavLink'
import { sections } from '@/src/constants/menu'

const Wrapper = styled.nav`
  align-items: center;
  column-gap: 32px;
  display: flex;
`

const NavLink = styled(BaseNavLink)`
  align-items: center;
  color: ${({ theme: { mainMenu } }) => mainMenu.color};
  display: flex;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;
  text-decoration: none;

  &.active {
  }

  &:hover {
    color: ${({ theme: { mainMenu } }) => mainMenu.colorHover};
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

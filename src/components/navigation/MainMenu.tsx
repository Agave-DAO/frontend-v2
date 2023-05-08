import styled from 'styled-components'

import { NavLink as BaseNavLink } from '@/src/components/navigation/NavLink'
import { sections } from '@/src/constants/menu'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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

  &:hover {
    color: ${({ theme: { mainMenu } }) => mainMenu.colorHover};
  }
`

export const MainMenu: React.FC = ({ ...restProps }) => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const isConnected = isWalletConnected && isWalletNetworkSupported

  return (
    <Wrapper {...restProps}>
      {isConnected && (
        <NavLink href="/my-account#home-tabs" scroll={false}>
          My account
        </NavLink>
      )}
      {sections.map(({ hash, href, section }) => {
        return (
          <NavLink
            href={`${href}${hash ? `#${hash}` : ''}`}
            key={`main_menu_item_${section}`}
            scroll={false}
          >
            {section}
          </NavLink>
        )
      })}
    </Wrapper>
  )
}

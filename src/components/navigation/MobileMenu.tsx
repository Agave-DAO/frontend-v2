import { DOMAttributes } from 'react'
import styled, { css } from 'styled-components'

import { LogoMini } from '@/src/components/assets/LogoMini'
import { ButtonConnect } from '@/src/components/buttons/ButtonConnect'
import { MobileMenuButton } from '@/src/components/buttons/MobileMenuButton'
import { SocialLinks } from '@/src/components/common/SocialLinks'
import { UserDropdown as BaseUserDropdown } from '@/src/components/header/UserDropdown'
import { NavLink as BaseNavLink } from '@/src/components/navigation/NavLink'
import { links } from '@/src/constants/links'
import { sections } from '@/src/constants/menu'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.span<{ isOpen?: boolean }>`
  --mobile-menu-min-width: 18px;
  --mobile-menu-transition-time: 0.25s;

  width: var(--mobile-menu-min-width);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    display: none;
  }

  ${({ isOpen }) =>
    isOpen
      ? css`
          background-color: ${({ theme: { colors } }) => colors.black};
          bottom: 0;
          display: flex;
          flex-direction: column;
          overflow-x: auto;
          position: fixed;
          right: 0;
          top: 0;
          transition: width var(--mobile-menu-transition-time) linear;
          width: 100vw;
          z-index: 5;
        `
      : css`
          .hideIfClosed {
            display: none;
          }
        `}
`

const Top = styled.span<{ isOpen?: boolean }>`
  ${({ isOpen }) =>
    isOpen &&
    css`
      background: ${({ theme: { mobileMenu } }) => mobileMenu.background};
      flex-shrink: 0;
      padding: var(--header-padding-top)
        ${({ theme: { layout } }) => layout.horizontalPaddingMobile} 100px;
    `}
`

const TopContents = styled.span<{ isOpen?: boolean }>`
  display: none;

  ${({ isOpen }) =>
    isOpen &&
    css`
      display: block;
    `}
`

const Head = styled.span<{ isOpen?: boolean }>`
  ${({ isOpen }) =>
    isOpen &&
    css`
      align-items: center;
      display: flex;
      height: calc(var(--header-full-height) - var(--header-padding-top));
      justify-content: space-between;
    `}
`

const Logo = styled(LogoMini)<{ isOpen?: boolean }>`
  ${({ isOpen }) =>
    !isOpen &&
    css`
      display: none;
    `}
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 80px 0 30px;
`

const UserControls = styled.span`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`

const UserDropdown = styled(BaseUserDropdown)`
  .dropdownItems {
    left: 0;
    right: auto;
  }
`

const Button = styled(ButtonConnect)`
  font-weight: 400;
`

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  row-gap: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

const MenuItem = css`
  --horizontal-padding: 10px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.black};
  background-image: url('data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNLjgzNyA3LjgzM2EuNTYzLjU2MyAwIDAxMC0uODA4TDMuOTI1IDQgLjgzNy45NzVhLjU2My41NjMgMCAwMTAtLjgwOC41OTIuNTkyIDAgMDEuODI1IDBsMy41IDMuNDI5YS41NjMuNTYzIDAgMDEwIC44MDhsLTMuNSAzLjQyOWEuNTkyLjU5MiAwIDAxLS44MjUgMHoiIGZpbGw9IiM5QkVGRDciLz48L3N2Zz4=');
  background-position: calc(100% - var(--horizontal-padding)) 50%;
  border-radius: 8px;
  color: ${({ theme: { colors } }) => colors.accent};
  display: flex;
  font-size: 1.8rem;
  font-weight: 400;
  height: 42px;
  justify-content: space-between;
  line-height: 1.2;
  padding: 0 var(--horizontal-padding);
  text-decoration: none;
  transition: opacity 0.25s linear;
  white-space: nowrap;

  &:active {
    opacity: 0.7;
  }
`

const NavLink = styled(BaseNavLink)`
  ${MenuItem}
`

const Link = styled.a`
  ${MenuItem}

  background-color: ${({ theme: { colors } }) => colors.darkestGray};
  color: ${({ theme: { colors } }) => colors.lighterGray};
`

const Bottom = styled.span<{ isOpen?: boolean }>`
  display: none;

  ${({ isOpen }) =>
    isOpen &&
    css`
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 0;
      padding: 45px ${({ theme: { layout } }) => layout.horizontalPaddingMobile} 0;
    `}
`

const Social = styled(SocialLinks)`
  margin-top: auto;
  padding: 40px 0;

  .socialTitle {
    color: ${({ theme: { colors } }) => colors.lightestGray};
    font-size: 1.2rem;
  }

  .socialLink {
    background-color: ${({ theme: { colors } }) => colors.darkerGray};
  }
`

interface Props extends DOMAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<Props> = ({ isOpen, onClose, ...restProps }) => {
  const { connectWallet, isWalletConnected } = useWeb3Connection()

  return (
    <Wrapper isOpen={isOpen} {...restProps}>
      <Top isOpen={isOpen}>
        <Head isOpen={isOpen}>
          <Logo isOpen={isOpen} />
          <MobileMenuButton isOpen={isOpen} onClick={onClose} />
        </Head>
        <TopContents isOpen={isOpen}>
          <Title>Menu</Title>
          <UserControls>
            {isWalletConnected && <UserDropdown />}
            {!isWalletConnected && <Button onClick={connectWallet}>Connect wallet</Button>}
          </UserControls>
          <Menu onClick={onClose}>
            {isWalletConnected && (
              <NavLink href="/my-account#home-tabs" scroll={false}>
                My account
              </NavLink>
            )}
            {sections.map(({ hash, href, section }) => {
              return (
                <NavLink
                  href={`${href}#${hash ? `${hash}` : 'main'}`}
                  key={`mobile_menu_item_${section}`}
                  scroll={false}
                >
                  {section}
                </NavLink>
              )
            })}
          </Menu>
        </TopContents>
      </Top>
      <Bottom isOpen={isOpen}>
        <Menu>
          {links.map(({ href, text }, index) => (
            <Link href={href} key={index} target="_blank">
              {text}
            </Link>
          ))}
        </Menu>
        <Social />
      </Bottom>
    </Wrapper>
  )
}

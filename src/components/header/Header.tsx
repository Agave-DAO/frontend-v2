import React, { useState } from 'react'
import styled from 'styled-components'

import { ButtonGradient } from '@/src/components/buttons/ButtonGradient'
import { Logo as BaseLogo } from '@/src/components/common/Logo'
// Disabled (for now)
// import { SwitchThemeButton } from '@/src/components/header/SwitchThemeButton'
import { UserDropdown } from '@/src/components/header/UserDropdown'
import { InnerContainer as BaseInnerContainer } from '@/src/components/helpers/InnerContainer'
import { MainMenu } from '@/src/components/navigation/MainMenu'
import { MobileMenu } from '@/src/components/navigation/MobileMenu'
import WrongNetwork from '@/src/components/utils/WrongNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.header`
  align-items: center;
  background-color: ${({ theme: { header } }) => header.backgroundColor};
  color: ${({ theme: { header } }) => header.color};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--header-full-height);
  padding-top: var(--header-padding-top);
  position: relative;
  z-index: 10;
`

const InnerContainer = styled(BaseInnerContainer)`
  align-items: center;
  flex-direction: row;
  flex-shrink: 0;
  height: 100%;
  justify-content: space-between;
`

const Logo = styled(BaseLogo)`
  height: 29px;
  width: 84px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    display: block;
    height: 46px;
    width: 133px;
  }
`

const End = styled.div`
  display: none;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    align-items: center;
    column-gap: 32px;
    display: flex;
    height: 100%;
    justify-content: flex-end;
  }
`

export const Header: React.FC = (props) => {
  const { connectWallet, isWalletConnected } = useWeb3Connection()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <Wrapper {...props}>
        <InnerContainer>
          <Logo />
          <End>
            <MainMenu />
            {/* Disabled (for now) */}
            {/* <SwitchThemeButton /> */}
            {isWalletConnected && <UserDropdown />}
            {!isWalletConnected && <ButtonGradient onClick={connectWallet}>Connect</ButtonGradient>}
          </End>
          <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
        </InnerContainer>
      </Wrapper>
      <WrongNetwork />
    </>
  )
}

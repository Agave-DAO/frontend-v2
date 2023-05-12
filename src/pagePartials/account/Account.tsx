import styled, { css } from 'styled-components'

import { ButtonConnect } from '@/src/components/buttons/ButtonConnect'
import { UserAccountSummary } from '@/src/pagePartials/account/UserAccountSummary'
import UserBalanceSummary from '@/src/pagePartials/account/UserBalanceSummary'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div<{ isConnected: boolean }>`
  display: flex;
  margin: 0 auto 64px;
  width: 100%;

  ${({ isConnected }) =>
    isConnected &&
    css`
      @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
        min-height: 358px;
      }

      @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.desktopStart}) {
        column-gap: 24px;
        display: grid;
        grid-template-columns: 1fr 2fr;
      }
    `}
`

const WelcomeText = styled.div<{ isConnected: boolean }>`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 75px;

  ${({ isConnected }) =>
    isConnected &&
    css`
      display: none;
    `}

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    align-items: center;
    text-align: center;
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.desktopStart}) {
    display: flex;
    max-width: 100%;
    padding-top: 0;
    width: 500px;

    ${({ isConnected }) =>
      isConnected
        ? css`
            align-items: flex-start;
            margin: auto;
            padding-left: 24px;
            text-align: left;
            width: auto;
          `
        : css`
            align-items: center;
            text-align: center;
          `}
  }
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 15px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 6.2rem;
    margin-bottom: 0 0 25px;
  }
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 32px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.6rem;
    margin-bottom: 40px;
  }
`

const Button = styled(ButtonConnect)`
  max-width: fit-content;
`

const MainTitle: React.FC = ({ ...restProps }) => (
  <Title {...restProps}>
    Earn interest <br></br>Borrow assets
  </Title>
)

const MainText: React.FC = ({ ...restProps }) => (
  <Text {...restProps}>DeFi lending protocol on Gnosis Chain</Text>
)

const MainTitleSmall = styled(MainTitle)`
  font-size: 4.2rem;
`

const MainTextSmall = styled(MainText)`
  font-size: 1.8rem;
  margin: 0;
`

const UserInfo = styled.div`
  background-image: ${({ theme: { colors } }) => colors.greenGradientLight};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  padding: 40px 16px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background-image: ${({ theme: { colors } }) => colors.greenGradientMedium};
    border-radius: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 36px 24px;
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    flex-grow: 1;
    width: auto;
  }
`

export const Account: React.FC = ({ ...restProps }) => {
  const { connectWallet, isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const isConnected = isWalletConnected && isWalletNetworkSupported

  return (
    <Wrapper isConnected={isConnected} {...restProps}>
      <WelcomeText isConnected={isConnected}>
        {isConnected ? <MainTitleSmall /> : <MainTitle />}
        {isConnected ? <MainTextSmall /> : <MainText />}
        {!isConnected && <Button onClick={connectWallet}>Connect wallet</Button>}
      </WelcomeText>
      {isConnected && (
        <UserInfo>
          <UserBalanceSummary />
          <UserAccountSummary />
        </UserInfo>
      )}
    </Wrapper>
  )
}

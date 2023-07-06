import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Faq } from '@/src/components/faq/Faq'
import { Tabs as BaseTabs, TabLink as Tab } from '@/src/components/tabs/Tabs'
import { homeFAQ } from '@/src/pagePartials/common/homeFAQ'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div<{ isConnected?: boolean }>`
  margin-bottom: 40px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    ${({ isConnected }) =>
      isConnected
        ? css`
            background: linear-gradient(
              180deg,
              ${({ theme: { colors } }) => colors.darkBackground02} 0%,
              ${({ theme: { colors } }) => colors.darkBackground0} 25.31%
            );
            border-radius: 24px;
            padding: 56px 40px;
            margin-bottom: 0;
          `
        : css`
            margin-bottom: 64px;
          `}
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    ${({ isConnected }) =>
      isConnected &&
      css`
        padding-left: 95px;
        padding-right: 95px;
      `}
  }
`

const Contents = styled.div``

const Tabs = styled(BaseTabs)`
  margin: 0 auto 40px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    margin-bottom: 56px;
  }
`

export const HomeTabs: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...restProps }) => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const isConnected = isWalletConnected && isWalletNetworkSupported

  return (
    <>
      <Wrapper id="home-tabs" isConnected={isConnected} {...restProps}>
        {isConnected && (
          <Tabs>
            <Tab href="/" scroll={false} shallow>
              All markets
            </Tab>
            <Tab href="/my-account" scroll={false} shallow>
              My account
            </Tab>
          </Tabs>
        )}
        <Contents>{children}</Contents>
      </Wrapper>
      <Faq data={homeFAQ} />
    </>
  )
}

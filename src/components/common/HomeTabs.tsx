import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Tabs as BaseTabs, TabLink as Tab } from '@/src/components/tabs/Tabs'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div<{ isConnected?: boolean }>`
  ${({ isConnected }) =>
    isConnected &&
    css`
      @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
        background: linear-gradient(
          180deg,
          ${({ theme: { colors } }) => colors.darkBackground02} 0%,
          ${({ theme: { colors } }) => colors.darkBackground0} 25.31%
        );
        border-radius: 24px;
        padding: 56px 95px 80px;
      }
    `}
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
    <Wrapper isConnected={isConnected} {...restProps}>
      {isConnected && (
        <Tabs>
          <Tab href="/">All markets</Tab>
          <Tab href="/my-account">My account</Tab>
        </Tabs>
      )}
      <Contents>{children}</Contents>
    </Wrapper>
  )
}

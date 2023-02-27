import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { ButtonCSS, ButtonPrimaryCSS } from '@/src/components/buttons/Button'
import { NavLink } from '@/src/components/navigation/NavLink'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div``

const Tabs = styled.div`
  display: flex;
  column-gap: 30px;
  justify-content: center;
  margin: 0 auto 50px;
`

const Tab = styled(NavLink)`
  ${ButtonCSS}
  ${ButtonPrimaryCSS}
  opacity: 0.5;

  &.active {
    opacity: 1;
  }
`

const Contents = styled.div``

export const HomeTabs: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...restProps }) => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const isConnected = isWalletConnected && isWalletNetworkSupported

  return (
    <Wrapper {...restProps}>
      {isConnected && (
        <Tabs>
          <Tab href="/my-account">My account</Tab>
          <Tab href="/">All markets</Tab>
        </Tabs>
      )}
      <Contents>{children}</Contents>
    </Wrapper>
  )
}

import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { ButtonConnect } from '@/src/components/buttons/Button'
import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 auto 10px;
  padding: 0 20px;
  text-align: center;
  text-decoration: none;
  width: 100%;
`

const TextBig = styled(Text)`
  font-size: 1.3rem;
`

type RequiredConnectionProps = {
  children: ReactElement
  minHeight?: number
  isNotConnectedText?: string
  isWrongNetworkText?: string
}

/**
 * Component that renders children only if user is connected to the wallet and is on the correct network.
 * If user is not connected, it renders a button to connect wallet and a text.
 * If user is connected to the wrong network, it renders a button to switch to the correct network and a text.
 * @param children - Component to render if user is connected to the wallet and is on the correct network
 * @param minHeight - Minimum height of the component
 * @param isNotConnectedText - Text to show if user is not connected
 * @param isWrongNetworkText - Text to show if user is connected to the wrong network
 * @returns Component that renders children only if user is connected to the wallet and is on the correct network.
 */
const RequiredConnection: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  isNotConnectedText = 'You must be logged in.',
  isWrongNetworkText = `Please switch to app network`,
  ...restProps
}) => {
  const { address, appChainId, connectWallet, isWalletConnected, pushNetwork, walletChainId } =
    useWeb3Connection()
  const isConnected = isWalletConnected && address
  const isWrongNetwork = isConnected && walletChainId !== appChainId

  if (!isConnected) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        {!!isNotConnectedText.length && <Text>{isNotConnectedText}</Text>}
        <ButtonConnect onClick={connectWallet}>Connect wallet</ButtonConnect>
      </Wrapper>
    )
  }

  if (isWrongNetwork) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        {!!isWrongNetworkText.length && <TextBig>{isWrongNetworkText}</TextBig>}
        <ButtonPrimary
          onClick={() => pushNetwork({ chainId: chainsConfig[appChainId].chainIdHex })}
        >
          Switch to {chainsConfig[appChainId].name}
        </ButtonPrimary>
      </Wrapper>
    )
  }

  return children
}

export { RequiredConnection }

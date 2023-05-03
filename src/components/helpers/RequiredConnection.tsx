import React, { DOMAttributes, HTMLAttributes, ReactElement } from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  justify-content: center;
  margin: auto;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0 auto 10px;
  padding: 0 20px;
  text-align: center;
  text-decoration: none;
  width: 100%;
`

interface RequiredConnectionProps
  extends DOMAttributes<HTMLDivElement>,
    HTMLAttributes<HTMLDivElement> {
  isNotConnectedText?: string
  isWrongNetworkText?: string
}

/**
 * Component that renders children only if user is connected to the wallet and is on the correct network.
 * If user is not connected, it renders a button to connect wallet and a text.
 * If user is connected to the wrong network, it renders a button to switch to the correct network and a text.
 * @param children - Component to render if user is connected to the wallet and is on the correct network
 * @param isNotConnectedText - Text to show if user is not connected
 * @param isWrongNetworkText - Text to show if user is connected to the wrong network
 * @returns Component that renders children only if user is connected to the wallet and is on the correct network.
 */
const RequiredConnection: React.FC<RequiredConnectionProps> = ({
  children,
  isNotConnectedText = 'You must connect your wallet.',
  isWrongNetworkText = `Please switch to app network`,
  ...restProps
}) => {
  const { address, appChainId, connectWallet, isWalletConnected, pushNetwork, walletChainId } =
    useWeb3Connection()
  const isConnected = isWalletConnected && address
  const isWrongNetwork = isConnected && walletChainId !== appChainId

  return !isConnected || isWrongNetwork ? (
    <Wrapper {...restProps}>
      {!isConnected && (
        <>
          {!!isNotConnectedText.length && <Text>{isNotConnectedText}</Text>}
          <ButtonPrimary onClick={connectWallet}>Connect wallet</ButtonPrimary>
        </>
      )}
      {isWrongNetwork && (
        <>
          {!!isWrongNetworkText.length && <Text>{isWrongNetworkText}</Text>}
          <ButtonPrimary
            onClick={() => pushNetwork({ chainId: chainsConfig[appChainId].chainIdHex })}
          >
            Switch to {chainsConfig[appChainId].name}
          </ButtonPrimary>
        </>
      )}
    </Wrapper>
  ) : (
    <>{children}</>
  )
}

export { RequiredConnection }

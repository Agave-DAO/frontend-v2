import React, { useState } from 'react'
import styled from 'styled-components'

import { ModalSwitchNetwork } from '@/src/components/helpers/ModalSwitchNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const ErrorSVG: React.FC = () => (
  <svg height="15" viewBox="0 0 15 15" width="15" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.218,21.718a7.5,7.5,0,1,1,7.5-7.5A7.5,7.5,0,0,1,14.218,21.718Zm0-14.062a6.562,6.562,0,1,0,6.562,6.563A6.563,6.563,0,0,0,14.218,7.655Zm.666,6.565,1.986,1.986a.469.469,0,0,1-.663.663L14.22,14.884l-2,2a.472.472,0,0,1-.668-.668l2-2-1.986-1.986a.469.469,0,0,1,.663-.663l1.986,1.986,2.014-2.014a.472.472,0,1,1,.668.668L14.884,14.22Z"
      fill="#d03333"
      transform="translate(-6.718 -6.718)"
    />
  </svg>
)

const Wrapper = styled.div`
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.2;
  display: flex;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.error};
`

const Underline = styled.div`
  cursor: pointer;
  margin-left: 8px;
  margin-right: 4px;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export const WrongNetwork: React.FC = ({ ...restProps }) => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  return isWalletConnected && !isWalletNetworkSupported ? (
    <>
      <Wrapper onClick={() => setShowNetworkModal(true)} {...restProps}>
        <ErrorSVG />
        <Underline>Switch to a valid network</Underline> to use the app!
      </Wrapper>
      {showNetworkModal && <ModalSwitchNetwork onClose={() => setShowNetworkModal(false)} />}
    </>
  ) : null
}

export default WrongNetwork

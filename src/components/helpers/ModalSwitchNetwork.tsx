import styled from 'styled-components'

import { Modal } from '@/src/components/common/Modal'
import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const NetworkButtons = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  padding: 0 20px;
  row-gap: 20px;
  width: 100%;
`

const NetworkButton = styled.button`
  background-color: transparent;
  border: 1px solid ${({ theme: { colors } }) => colors.lightGreen};
  border-radius: 3px;
  color: ${({ theme: { colors } }) => colors.lightGreen};
  cursor: pointer;
  font-size: 1.5rem;
  height: 30px;
  width: 100%;

  &:active {
    opacity: 0.7;
  }

  &:hover {
    border-color: ${({ theme: { colors } }) => colors.lighterGreen};
  }
`

export const ModalSwitchNetwork: React.FC<{ onClose: () => void }> = ({
  onClose,
  ...restProps
}) => {
  const { pushNetwork, setAppChainId } = useWeb3Connection()
  const chainOptions = Object.values(chainsConfig)

  return (
    <Modal onClose={onClose} size="sm" title="Choose a network" {...restProps}>
      <NetworkButtons>
        {chainOptions.map((item, index) => (
          <NetworkButton
            key={index}
            onClick={() => {
              setAppChainId(item.chainId)
              pushNetwork({ chainId: item.chainIdHex })
              onClose()
            }}
          >
            {item.name}
          </NetworkButton>
        ))}
      </NetworkButtons>
    </Modal>
  )
}

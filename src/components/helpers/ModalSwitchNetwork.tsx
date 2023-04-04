import styled from 'styled-components'

import { ButtonDark } from '@/src/components/buttons/Button'
import { Modal } from '@/src/components/modals/Modal'
import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const NetworkButtons = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
  padding: 0 20px;
  row-gap: 10px;
  width: 100%;
`

const Button = styled(ButtonDark)`
  height: 48px;
  width: 100%;
  font-weight: 600;
`

export const ModalSwitchNetwork: React.FC = ({ ...restProps }) => {
  const { pushNetwork, setAppChainId } = useWeb3Connection()
  const chainOptions = Object.values(chainsConfig)

  return (
    <Modal size="sm" title="Switch to a valid network" {...restProps}>
      <NetworkButtons>
        {chainOptions.map((item, index) => (
          <Button
            borderRadiusVariant="round"
            key={index}
            onClick={() => {
              setAppChainId(item.chainId)
              pushNetwork({ chainId: item.chainIdHex })
            }}
          >
            {item.name}
          </Button>
        ))}
      </NetworkButtons>
    </Modal>
  )
}

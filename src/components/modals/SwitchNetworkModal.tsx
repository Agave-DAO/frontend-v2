import styled from 'styled-components'

import { ButtonDark } from '@/src/components/buttons/Button'
import { Modal } from '@/src/components/modals/Modal'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Title = styled(BaseTitle)`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

const Paragraph = styled(BaseParagraph)`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`

const NetworkButtons = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 400px;
  min-height: 200px;
  padding: 0 20px;
  row-gap: 10px;
  width: 100%;
`

const Button = styled(ButtonDark)`
  font-weight: 600;
  height: 48px;
  width: 100%;
`

export const SwitchNetworkModal: React.FC = ({ ...restProps }) => {
  const { pushNetwork, setAppChainId } = useWeb3Connection()
  const chainOptions = Object.values(chainsConfig)

  return (
    <Modal {...restProps}>
      <Title>Wrong network</Title>
      <Paragraph>Please select a valid network from the list.</Paragraph>
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

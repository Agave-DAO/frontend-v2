import { ModalSwitchNetwork } from '@/src/components/helpers/ModalSwitchNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export const WrongNetwork: React.FC = () => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()

  return isWalletConnected && !isWalletNetworkSupported ? <ModalSwitchNetwork /> : null
}

export default WrongNetwork

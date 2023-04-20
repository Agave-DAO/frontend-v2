import { SwitchNetworkModal } from '@/src/components/modals/SwitchNetworkModal'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export const WrongNetwork: React.FC = () => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()

  return isWalletConnected && !isWalletNetworkSupported ? <SwitchNetworkModal /> : null
}

export default WrongNetwork

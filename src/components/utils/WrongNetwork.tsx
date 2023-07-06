import { SwitchNetworkModal } from '@/src/components/modals/SwitchNetworkModal'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export const WrongNetwork: React.FC = () => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()

  return <SwitchNetworkModal isOpen={isWalletConnected && !isWalletNetworkSupported} />
}

export default WrongNetwork

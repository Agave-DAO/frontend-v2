import { useEffect, useMemo, useState } from 'react'

import { Web3Provider } from '@ethersproject/providers'

import { getGnsNetworkConfig } from '../config/web3'
import { useWeb3Connection } from '../providers/web3ConnectionProvider'

export const useGnsName = () => {
  const { address, wallet } = useWeb3Connection()

  const gnsProvider = useMemo(
    () =>
      wallet?.provider != null ? new Web3Provider(wallet.provider, getGnsNetworkConfig()) : null,
    [wallet],
  )

  const [domain, setDomain] = useState<string | null>()
  useEffect(() => {
    if (!address || !gnsProvider) return
    const getDomain = async () => {
      try {
        const domain = await gnsProvider.lookupAddress(address)
        setDomain(domain)
      } catch (error) {
        setDomain(null)
        console.log('GNS reverse lookup error: ', error)
      }
    }
    getDomain()
  }, [address, gnsProvider])
  return domain
}

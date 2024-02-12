import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { JsonRpcBatchProvider, JsonRpcProvider } from '@ethersproject/providers'
import nullthrows from 'nullthrows'

import { Chains, INITIAL_APP_CHAIN_ID, getNetworkConfig } from '@/src/config/web3'

nullthrows(
  Object.values(Chains).includes(INITIAL_APP_CHAIN_ID) ? INITIAL_APP_CHAIN_ID : null,
  'No default chain ID is defined or is not supported',
)

type Props = {
  children: ReactNode
  onProviderReady: (isReady: boolean) => void
}

type RpcContextType = {
  rpcProvider: JsonRpcProvider | null
  rpcBatchProvider: JsonRpcBatchProvider | null
  rpcUrl: string
}

const RpcContext = createContext<RpcContextType | undefined>(undefined)

export default function RpcProvider({ children, onProviderReady }: Props) {
  const [rpcProvider, setRpcProvider] = useState<JsonRpcProvider | null>(null)
  const [rpcBatchProvider, setRpcBatchProvider] = useState<JsonRpcBatchProvider | null>(null)
  const [currentRpcIndex, setCurrentRpcIndex] = useState(0)
  const rpcUrls = getNetworkConfig(INITIAL_APP_CHAIN_ID).rpcUrl
  const [rpcUrl, setRpcUrl] = useState<string>(rpcUrls[currentRpcIndex])

  const createProviders = (url: string) => {
    setRpcProvider(new JsonRpcProvider(url))
    setRpcBatchProvider(new JsonRpcBatchProvider(url))
    console.log('New provider: ', url)
  }

  useEffect(() => {
    onProviderReady(rpcProvider !== null && rpcBatchProvider !== null)
  }, [onProviderReady, rpcBatchProvider, rpcProvider])

  useEffect(() => {
    const checkProvider = async () => {
      const providerCheck = new Promise((resolve, reject) => {
        const provider = new JsonRpcProvider(rpcUrls[currentRpcIndex])
        provider
          .getNetwork()
          .then((network) => {
            if (network) resolve('OK')
          })
          .catch((error) => {
            reject(error)
          })
      })

      const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000)
      })

      try {
        await Promise.race([providerCheck, timeout])
        console.log('Provider check: OK')
      } catch (error) {
        console.warn(`Provider ${rpcUrls[currentRpcIndex]} failed. Switching to next provider...`)
        setCurrentRpcIndex((prevIndex) => (prevIndex + 1) % rpcUrls.length)
      }
    }

    checkProvider()
  }, [currentRpcIndex, rpcUrls])

  useEffect(() => {
    setRpcUrl(rpcUrls[currentRpcIndex])
    createProviders(rpcUrls[currentRpcIndex])
  }, [currentRpcIndex, rpcUrls])

  return (
    <RpcContext.Provider value={{ rpcProvider, rpcBatchProvider, rpcUrl }}>
      {children}
    </RpcContext.Provider>
  )
}

export function useRpc() {
  const context = useContext(RpcContext)
  if (context === undefined) {
    throw new Error('useRpc must be used within an RpcProvider')
  }
  return context
}

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcBatchProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { OnboardAPI, WalletState } from '@web3-onboard/core'
import frameModule from '@web3-onboard/frame'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import { init, useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import walletConnectModule, { WalletConnectOptions } from '@web3-onboard/walletconnect'
import nullthrows from 'nullthrows'

import { Chains, INITIAL_APP_CHAIN_ID, chainsConfig, getNetworkConfig } from '@/src/config/web3'
import { NATIVE_DECIMALS } from '@/src/constants/common'
import {
  recoverLocalStorageKey,
  removeLocalStorageKey,
  setLocalStorageKey,
} from '@/src/hooks/usePersistedState'
import { ModalCSS } from '@/src/theme/onBoard'
import { toWei } from '@/src/utils/common'
import { hexToNumber } from '@/src/utils/strings'
import { ChainConfig, ChainsValues } from '@/types/chains'
import { RequiredNonNull } from '@/types/utils'

const STORAGE_CONNECTED_WALLET = 'onboard_selectedWallet'

// Default chain id from env var
nullthrows(
  Object.values(Chains).includes(INITIAL_APP_CHAIN_ID) ? INITIAL_APP_CHAIN_ID : null,
  'No default chain ID is defined or is not supported',
)

const injected = injectedModule()
const frame = frameModule()
const gnosis = gnosisModule()

const wcV1InitOptions = {
  version: 1,
  bridge: 'https://safe-walletconnect.safe.global',
  connectFirstChainId: true,
  qrcodeModalOptions: { mobileLinks: ['minerva', 'trust'] },
}

const wcV2InitOptions: WalletConnectOptions = {
  /**
   * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
   */
  projectId: '006ebb71415ac00246c619155f5d56f7',
  /**
   * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
   * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
   * To connect with walletconnect
   */
  dappUrl: 'https://agave.finance',
  /**
   * Defaults to version: 2
   */
  version: 2,
  /**
   * List of Required Chain(s) ID for wallets to support in number format (integer or hex)
   * Defaults to [1] - Ethereum
   */
  requiredChains: [100],
}

const walletConnect = walletConnectModule(wcV2InitOptions || wcV1InitOptions)

const chainsForOnboard = Object.values(chainsConfig).map(
  ({ chainIdHex, name, rpcUrl, token }: ChainConfig) => ({
    id: chainIdHex,
    label: name,
    token,
    rpcUrl: rpcUrl[0],
  }),
)

let onBoardApi: OnboardAPI

export function initOnboard() {
  if (typeof window === 'undefined' || window?.onboard || onBoardApi) return

  onBoardApi = init({
    wallets: [injected, frame, gnosis, walletConnect],
    chains: chainsForOnboard,
    connect: {
      removeWhereIsMyWalletWarning: true,
    },
    notify: {
      enabled: false,
    },
    appMetadata: {
      name: 'Agave',
      icon: 'https://agave.finance/favicon/favicon.svg',
      description:
        'Earn interest on deposits and borrow assets thanks to Agave, a decentralized, non-custodial money market and lending protocol on Gnosis Chain',
      recommendedInjectedWallets: [
        { name: 'Frame', url: 'https://frame.sh' },
        { name: 'Rabby', url: 'https://rabby.io/' },
      ],
    },
    // Account center put an interactive menu in the UI to manage your account.
    accountCenter: {
      desktop: {
        enabled: false,
      },
      mobile: {
        enabled: false,
      },
    },
    // i18n: {} change all texts in the onboard modal
  })
  window.onboard = onBoardApi
}

declare type SetChainOptions = {
  chainId: string
  chainNamespace?: string
}

export type Web3Context = {
  address: string | null
  appChainId: ChainsValues
  balance?: BigNumber
  connectWallet: () => Promise<void> | null
  connectingWallet: boolean
  disconnectWallet: () => Promise<void> | null
  getExplorerUrl: (hash: string) => string
  isAppConnected: boolean
  isOnboardChangingChain: boolean
  isWalletConnected: boolean
  isWalletNetworkSupported: boolean
  pushNetwork: (options: SetChainOptions) => Promise<boolean>
  readOnlyAppProvider: JsonRpcProvider
  setAppChainId: Dispatch<SetStateAction<ChainsValues>>
  wallet: WalletState | null
  walletChainId: number | null
  web3Provider: Web3Provider | null
  batchProvider: JsonRpcBatchProvider
  batchProviderFallback: JsonRpcBatchProvider
}

export type Web3Connected = RequiredNonNull<Web3Context>

const Web3ContextConnection = createContext<Web3Context | undefined>(undefined)

type Props = {
  children: ReactNode
}

// Initialize onboarding
initOnboard()

/**
 * This is a workaround (hacky shit) to add custom CSS to the onboard modal
 */
const setCSSStyles = () => {
  const style = document.createElement('style')

  style.innerHTML = ModalCSS

  const onboardV2 = document.querySelector('onboard-v2')

  if (onboardV2 && onboardV2.shadowRoot) {
    onboardV2.shadowRoot.appendChild(style)
  }
}

export default function Web3ConnectionProvider({ children }: Props) {
  const [{ connecting: connectingWallet, wallet }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [appChainId, setAppChainId] = useState(INITIAL_APP_CHAIN_ID)
  const [address, setAddress] = useState<string | null>(null)

  const web3Provider = wallet?.provider != null ? new Web3Provider(wallet.provider) : null

  const walletChainId = hexToNumber(connectedChain?.id)

  const isWalletConnected = web3Provider != null && address != null

  const isAppConnected = isWalletConnected && walletChainId === appChainId

  const isWalletNetworkSupported = chains.some(({ id }) => id === connectedChain?.id)

  const readOnlyAppProvider = useMemo(
    () => new JsonRpcProvider(getNetworkConfig(appChainId)?.rpcUrl[0], appChainId),
    [appChainId],
  )

  const batchProvider = useMemo(
    () => new JsonRpcBatchProvider(getNetworkConfig(appChainId)?.rpcUrl[0], appChainId),
    [appChainId],
  )
  const batchProviderFallback = useMemo(
    () => new JsonRpcBatchProvider(getNetworkConfig(appChainId)?.rpcUrl[1], appChainId),
    [appChainId],
  )

  useEffect(() => {
    if (isWalletNetworkSupported && walletChainId) {
      setAppChainId(walletChainId as SetStateAction<ChainsValues>)
    }
  }, [walletChainId, isWalletNetworkSupported])

  // Save connected wallets to localstorage
  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(({ label }) => label)
    setLocalStorageKey(STORAGE_CONNECTED_WALLET, connectedWalletsLabelArray)
  }, [connectedWallets, wallet])

  // Set user address when connect wallet
  useEffect(() => {
    if (wallet) {
      setAddress(wallet.accounts[0].address)
    } else {
      setAddress(null)
    }
  }, [wallet])

  // Auto connect wallet if localStorage has values
  useEffect(() => {
    const previouslyConnectedWallets = recoverLocalStorageKey(STORAGE_CONNECTED_WALLET, [])
    if (previouslyConnectedWallets?.length && !connectedWallets.length) {
      const setWalletFromLocalStorage = async () =>
        await connect({
          autoSelect: { label: previouslyConnectedWallets[0], disableModals: true },
        })

      setWalletFromLocalStorage()
    }
  }, [connect, chains, connectedWallets.length])

  const getExplorerUrl = useMemo(() => {
    const url = chainsConfig[appChainId]?.blockExplorerUrls[0]
    return (hash: string) => {
      const type = hash.length > 42 ? 'tx' : 'address'
      return `${url}${type}/${hash}`
    }
  }, [appChainId])

  const handleDisconnectWallet = async () => {
    if (wallet) {
      removeLocalStorageKey(STORAGE_CONNECTED_WALLET)
      disconnect(wallet)
    }
  }

  const handleConnectWallet = async () => {
    if (window.onboard) {
      connect()
    }
  }

  setCSSStyles()

  const value: Web3Context = {
    address,
    appChainId,
    balance:
      // as the balance is an object of the type { [nativeTokenSymbol: string]: string },
      // to make it agnostic to the token symbol, we get the first value of the object
      wallet?.accounts[0].balance && Object.values(wallet?.accounts[0].balance).length
        ? toWei(Object.values(wallet.accounts[0].balance)[0], NATIVE_DECIMALS)
        : undefined,
    connectWallet: handleConnectWallet,
    connectingWallet,
    disconnectWallet: handleDisconnectWallet,
    getExplorerUrl,
    isAppConnected,
    isOnboardChangingChain: settingChain,
    isWalletConnected,
    isWalletNetworkSupported,
    pushNetwork: setChain,
    readOnlyAppProvider,
    setAppChainId,
    wallet,
    walletChainId,
    web3Provider,
    batchProvider,
    batchProviderFallback,
  }

  return <Web3ContextConnection.Provider value={value}>{children}</Web3ContextConnection.Provider>
}

export function useWeb3Connection() {
  const context = useContext(Web3ContextConnection)
  if (context === undefined) {
    throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider')
  }
  return context
}

export function useWeb3ConnectedApp() {
  const context = useWeb3Connection()
  if (!context.isAppConnected) {
    throw new Error('useWeb3ConnectedApp must be used within a connected context')
  }
  return context as Web3Connected
}

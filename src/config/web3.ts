import nullthrows from 'nullthrows'

import { ChainConfig, ChainsValues } from '@/types/chains'
import { ObjectValues, ProviderChains, RPCProviders, RPCProvidersENV } from '@/types/utils'

export const Chains = {
  //mainnet: 1,
  goerli: 5,
} as const

export const providerChains: ProviderChains = {
  [RPCProviders.infura]: {
    //[Chains.mainnet]: 'mainnet',
    [Chains.goerli]: 'goerli',
  },
  [RPCProviders.alchemy]: {
    //[Chains.mainnet]: 'eth-mainnet',
    [Chains.goerli]: 'eth-goerli',
  },
}

const getInfuraRPCUrl = (chainId: ChainsValues) =>
  `https://${providerChains[RPCProviders.infura][chainId]}.infura.io/v3/${
    process.env.NEXT_PUBLIC_INFURA_TOKEN
  }`

const getAlchemyRPCUrl = (chainId: ChainsValues) =>
  `https://${providerChains[RPCProviders.alchemy][chainId]}.g.alchemy.com/v2/${
    process.env.NEXT_PUBLIC_ALCHEMY_TOKEN
  }`

export const getProviderUrl = (
  chainId: ChainsValues,
  provider?: ObjectValues<typeof RPCProviders>,
) => {
  if (!RPCProvidersENV[RPCProviders.infura] && !RPCProvidersENV[RPCProviders.alchemy]) {
    throw new Error(`You must set infura/alchemy token provider in environment variable`)
  }

  //Manual provider
  if (provider === RPCProviders.infura && RPCProvidersENV[RPCProviders.infura])
    return getInfuraRPCUrl(chainId)

  if (provider === RPCProviders.alchemy && RPCProvidersENV[RPCProviders.alchemy])
    return getAlchemyRPCUrl(chainId)

  // Auto-magic provider
  if (RPCProvidersENV[RPCProviders.infura]) return getInfuraRPCUrl(chainId)
  if (RPCProvidersENV[RPCProviders.alchemy]) return getAlchemyRPCUrl(chainId)

  throw Error('Token provider could not be found')
}

// Default chain id from env var
export const INITIAL_APP_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || '42',
) as ChainsValues

export const chainsConfig: Record<ChainsValues, ChainConfig> = {
  [Chains.goerli]: {
    id: Chains.goerli,
    name: 'Görli Testnet',
    shortName: 'Goerli',
    chainId: Chains.goerli,
    chainIdHex: '0x5',
    rpcUrl: getProviderUrl(Chains.goerli),
    blockExplorerUrls: ['https://goerli.etherscan.io/'],
    token: 'ETH',
  },
  // [Chains.mainnet]: {
  //   id: Chains.mainnet,
  //   name: 'Mainnet',
  //   shortName: 'Mainnet',
  //   chainId: Chains.mainnet,
  //   chainIdHex: '0x1',
  //   rpcUrl: getProviderUrl(Chains.mainnet),
  //   blockExplorerUrls: ['https://etherscan.io/'],
  //   token: 'ETH',
  // },
}

export function getNetworkConfig(chainId: ChainsValues): ChainConfig {
  const networkConfig = chainsConfig[chainId]
  return nullthrows(networkConfig, `No config for chain id: ${chainId}`)
}

/**
 * @dev Here you can add the list of tokens you want to use in the app
 * The list follow the standard from: https://tokenlists.org/
 */
export const TokensLists = {
  '1INCH': 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
  COINGECKO: 'https://tokens.coingecko.com/uniswap/all.json',
  OPTIMISM: 'https://static.optimism.io/optimism.tokenlist.json',
} as const

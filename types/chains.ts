import { Chains } from '@/src/config/web3'
import { ObjectValues } from '@/types/utils'

export type ChainConfig = {
  id: ChainsValues
  name: string
  shortName: string
  chainId: ChainsValues
  chainIdHex: string
  rpcUrl: string[]
  blockExplorerUrls: string[]
  token: string
}

export type ChainsValues = ObjectValues<typeof Chains>
export type ChainsKeys = keyof typeof Chains

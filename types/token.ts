import type { TokenInfo, TokenList } from '@uniswap/token-lists'

import { IStringIndex } from '@/types/utils'

export type Token = IStringIndex &
  TokenInfo & {
    extensions: {
      isNative: boolean
      isNativeWrapper: boolean
    }
  }
export type TokenListResponse = TokenList & {
  tokens: Token[]
}

export type TokensByAddress = { [address: string]: Token }
export type TokensBySymbol = { [symbol: string]: Token }
export type TokensByNetwork = { [networkId: number]: Token[] }

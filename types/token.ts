import type { TokenInfo, TokenList } from '@uniswap/token-lists'

export type Token = TokenInfo
export type TokenListResponse = TokenList

export type TokensByAddress = { [address: string]: Token }
export type TokensBySymbol = { [symbol: string]: Token }
export type TokensByNetwork = { [networkId: number]: Token[] }

export function isTokenTuple(tokens: [Token | null, Token | null]): tokens is [Token, Token] {
  return tokens.every((token) => token !== null)
}

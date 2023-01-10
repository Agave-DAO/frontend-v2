import { protocolTokens } from '@/public/protocolTokens.json'
import { tokens } from '@/public/underlyingTokens.json'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { Token } from '@/types/token'

export type AgaveProtocolTokens = {
  [underlying: string]: {
    ag: string
    variableDebt: string
    stableDebt: string
    strategy: string
    oracle: string
    name: string // added to ease traceability
  }
}

export type AgaveProtocolTokenType = 'ag' | 'variableDebt' | 'stableDebt'

export interface IDAgaveTokens {
  underlyingTokens: Token[]
  protocolTokens: AgaveProtocolTokens
  getUnderlyingTokenInfoByAddress: (address: string) => Token
  getTokenByAddress: (address: string) => Token
  getProtocolTokensByUnderlying: (address: string) => AgaveProtocolTokens['underlying']
  getProtocolTokenInfo: (underlying: string, tokenType: AgaveProtocolTokenType) => Token
  allTokensInfo: Token[]
}

const TOKENS_BY_UNDERLYING: AgaveProtocolTokens = protocolTokens

class AgaveTokens implements IDAgaveTokens {
  private _underlyingTokens: Token[] = tokens
  private _protocolTokens: AgaveProtocolTokens = TOKENS_BY_UNDERLYING
  private _protocolName = 'Agave'

  get underlyingTokens() {
    return this._underlyingTokens
  }

  get protocolTokens() {
    return this._protocolTokens
  }

  getUnderlyingTokenInfoByAddress(address: string): Token {
    const tokenInfo = this._underlyingTokens.find((token) => isSameAddress(token.address, address))

    if (!tokenInfo) {
      throw Error('Unsupported underlying token')
    }

    return tokenInfo
  }

  getTokenByAddress(address: string): Token {
    const tokenInfo = this.allTokensInfo.find((token) => isSameAddress(token.address, address))

    if (!tokenInfo) {
      throw Error('Unsupported token')
    }
    return tokenInfo
  }

  getProtocolTokensByUnderlying(underlying: string): AgaveProtocolTokens['underlying'] {
    const protocolTokens = this._protocolTokens[underlying]

    if (!protocolTokens) {
      throw Error('Unsupported underlying token')
    }

    return protocolTokens
  }

  getProtocolTokenInfo(underlying: string, tokenType: AgaveProtocolTokenType): Token {
    const tokenInfo = this.getUnderlyingTokenInfoByAddress(underlying)
    const protocolTokens = this.getProtocolTokensByUnderlying(underlying)

    switch (tokenType) {
      case 'ag':
        return {
          ...tokenInfo,
          address: protocolTokens.ag,
          name: `${this._protocolName} interest bearing ${tokenInfo.symbol}`,
          symbol: `ag${tokenInfo.symbol}`,
        }
      case 'variableDebt':
        return {
          ...tokenInfo,
          address: protocolTokens.variableDebt,
          name: `${this._protocolName} variable debt bearing ${tokenInfo.symbol}`,
          symbol: `variableDebt${tokenInfo.symbol}`,
        }
      case 'stableDebt':
        return {
          ...tokenInfo,
          address: protocolTokens.stableDebt,
          name: `${this._protocolName} stable debt bearing ${tokenInfo.symbol}`,
          symbol: `stableDebt${tokenInfo.symbol}`,
        }
      default:
        throw new Error('Unsupported token type')
    }
  }

  get allTokensInfo(): Token[] {
    return [
      ...this.underlyingTokens,
      ...Object.values(this.underlyingTokens).map(({ address }) => {
        return {
          ...this.getProtocolTokenInfo(address, 'ag'),
          ...this.getProtocolTokenInfo(address, 'variableDebt'),
          ...this.getProtocolTokenInfo(address, 'stableDebt'),
        }
      }),
    ]
  }
}

export const agaveTokens = new AgaveTokens()

import { protocolTokens } from '@/public/protocolTokens.json'
import { tokens } from '@/public/underlyingTokens.json'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { Token } from '@/types/token'
import { RequiredFieldsOnly } from '@/types/utils'

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

  constructor() {
    // runtime check to prevent consuming invalid token info
    this.allTokensInfo.every(this.isValidTokenInfo)
  }

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
    const foundToken = Object.entries(this._protocolTokens).find(([address]) =>
      isSameAddress(address, underlying),
    )

    if (!foundToken) {
      throw Error('Unsupported underlying token')
    }

    const [, protocolTokens] = foundToken

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

  getTokenBy(fieldAndValue: Partial<RequiredFieldsOnly<Token>>): Token | undefined {
    const [field, value] = Object.entries(fieldAndValue)[0]

    if (!field || !value) {
      throw new Error('Invalid field and value')
    }

    if (typeof value === 'number') {
      return this.allTokensInfo.find((token) => token[field] === value)
    }

    if (field === 'address') {
      return this.allTokensInfo.find((token) => isSameAddress(token[field], value))
    }

    return this.allTokensInfo.find((token) => token[field].toLowerCase() === value.toLowerCase())
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

  private isValidTokenInfo(tokenInfo: Token) {
    if (tokenInfo.address === undefined) {
      throw new Error('Token address is required')
    }

    if (tokenInfo.symbol === undefined) {
      throw new Error('Token symbol is required')
    }

    if (tokenInfo.decimals === undefined) {
      throw new Error('Token decimals is required')
    }

    if (tokenInfo.name === undefined) {
      throw new Error('Token name is required')
    }

    if (tokenInfo.logoURI === undefined) {
      throw new Error('Token logoURI is required')
    }

    if (tokenInfo.chainId === undefined) {
      throw new Error('Token chainId is required')
    }

    return true
  }
}

export const agaveTokens = new AgaveTokens()

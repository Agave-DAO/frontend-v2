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
    symbol: string // added to ease traceability
  }
}

export type AgaveProtocolTokenType = 'ag' | 'variableDebt' | 'stableDebt' | 'underlying'

export type TokenWithType = Token & { type: AgaveProtocolTokenType }

export type TokenInfo = Pick<TokenWithType, 'address' | 'symbol' | 'type'>

type ValidLookupFields = Pick<Token, 'address' | 'symbol' | 'name'>

export interface IDAgaveTokens {
  underlyingTokens: Token[]
  protocolTokens: AgaveProtocolTokens
  allTokens: TokenWithType[]
  getRelatedTokensByAddress: (tokenAddress: string) => TokenInfo[]
  getTokenByAddress: (tokenAddress: string) => TokenWithType
  getTokenByFieldAndValue: (fieldAndValue: ValidLookupFields) => TokenWithType | undefined
}

class AgaveTokens implements IDAgaveTokens {
  private _underlyingTokens: Token[] = tokens
  private _protocolTokens: AgaveProtocolTokens = protocolTokens
  private _protocolName = 'Agave'
  private _validLookupFields: (keyof ValidLookupFields)[] = ['address', 'symbol', 'name']

  constructor() {
    // runtime check to prevent consuming invalid token info
    this.allTokens.every(this.isValidTokenInfo)
  }

  get underlyingTokens() {
    return this._underlyingTokens
  }

  get protocolTokens() {
    return this._protocolTokens
  }

  get allTokens(): TokenWithType[] {
    return [
      ...this.underlyingTokens.map((tokenInfo) => ({
        ...tokenInfo,
        type: 'underlying' as AgaveProtocolTokenType,
      })),
      ...Object.values(this.underlyingTokens).flatMap(({ address }) => {
        return [
          { ...this.getProtocolTokenInfo(address, 'ag'), type: 'ag' as AgaveProtocolTokenType },
          {
            ...this.getProtocolTokenInfo(address, 'variableDebt'),
            type: 'variableDebt' as AgaveProtocolTokenType,
          },
          {
            ...this.getProtocolTokenInfo(address, 'stableDebt'),
            type: 'stableDebt' as AgaveProtocolTokenType,
          },
        ]
      }),
    ]
  }

  getRelatedTokensByAddress(tokenAddress: string): TokenInfo[] {
    const tokenInfo = this.getTokenByAddress(tokenAddress)

    if (tokenInfo.type === 'underlying') {
      // discard `oracle`, `strategy`, and `symbol` from protocol tokens
      const { oracle, strategy, symbol, ...protocolTokens } = this.getProtocolTokensByUnderlying(
        tokenInfo.address,
      )

      return [
        {
          address: tokenInfo.address,
          symbol: tokenInfo.symbol,
          type: tokenInfo.type as AgaveProtocolTokenType,
        },
        ...Object.values(protocolTokens)
          .map(this.getTokenByAddress.bind(this))
          .map(({ address, symbol, type }) => ({
            address,
            symbol,
            type: type as AgaveProtocolTokenType,
          })),
      ]
    } else {
      const underlyingToken = this.getUnderlyingTokenByAddress(tokenAddress)

      if (!underlyingToken) {
        throw Error('Unsupported token')
      }

      return this.getRelatedTokensByAddress(underlyingToken.address)
    }
  }

  getTokenByAddress(tokenAddress: string): TokenWithType {
    const tokenInfo = this.getTokenByFieldAndValue({ address: tokenAddress })

    if (!tokenInfo) {
      throw Error('Unsupported token')
    }

    return tokenInfo
  }

  getTokenByFieldAndValue(
    fieldAndValue: Partial<RequiredFieldsOnly<Token>>,
  ): TokenWithType | undefined {
    const [field, value] = Object.entries(fieldAndValue)[0]

    if (!field || !value) {
      throw new Error('field and value are required')
    }

    if (!this._validLookupFields.some((validField) => validField === field)) {
      throw new Error('Invalid field')
    }

    if (field === 'address') {
      return this.allTokens.find((token) => isSameAddress(token[field], value))
    }

    return this.allTokens.find((token) => token[field].toLowerCase() === value.toLowerCase())
  }

  private getUnderlyingTokenByAddress(tokenAddress: string): Token {
    // lookup underlying token by underlying address
    const tokenInfo = this._underlyingTokens.find((token) =>
      isSameAddress(token.address, tokenAddress),
    )

    // if not found, lookup underlying token by protocol token address
    if (!tokenInfo) {
      const foundToken = Object.entries(this._protocolTokens).find(
        ([, { ag, stableDebt, variableDebt }]) => {
          return (
            isSameAddress(ag, tokenAddress) ||
            isSameAddress(stableDebt, tokenAddress) ||
            isSameAddress(variableDebt, tokenAddress)
          )
        },
      )

      if (!foundToken) {
        throw Error('Unsupported token')
      }

      const [underlyingAddress] = foundToken

      return this.getUnderlyingTokenByAddress(underlyingAddress)
    }

    return tokenInfo
  }

  private getProtocolTokensByUnderlying(
    underlyingAddress: string,
  ): AgaveProtocolTokens['underlyingAddress'] {
    const foundToken = Object.entries(this._protocolTokens).find(([address]) =>
      isSameAddress(address, underlyingAddress),
    )

    if (!foundToken) {
      throw Error('Unsupported underlyingAddress token')
    }

    const [, protocolTokens] = foundToken

    return protocolTokens
  }

  private getProtocolTokenInfo(
    underlyingAddress: string,
    tokenType: AgaveProtocolTokenType,
  ): Token {
    const tokenInfo = this.getUnderlyingTokenByAddress(underlyingAddress)
    const protocolTokens = this.getProtocolTokensByUnderlying(underlyingAddress)

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

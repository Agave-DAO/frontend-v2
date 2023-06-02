import nativeToken from '@/public/nativeToken.json'
import protocolTokens from '@/public/protocolTokens.json'
import reserveTokens from '@/public/reserveTokens.json'
import stakeToken from '@/public/stakeToken.json'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { memoize } from '@/src/utils/memoize'
import { Token } from '@/types/token'
import { RequiredFieldsOnly } from '@/types/utils'

export type AgaveProtocolTokens = {
  [reserve: string]: {
    ag: string
    variableDebt: string
    stableDebt: string
    strategy: string
    oracle: string
    symbol: string // added to ease traceability
  }
}

export type AgaveProtocolTokenType =
  | 'ag'
  | 'variableDebt'
  | 'stableDebt'
  | 'reserve'
  | 'native'
  | 'stake'

export type TokenWithType = Token & { type: AgaveProtocolTokenType }

export type TokenInfo = Pick<TokenWithType, 'address' | 'symbol' | 'type'>

type ValidLookupFields = Pick<Token, 'address' | 'symbol' | 'name'>

export interface IDAgaveTokens {
  nativeToken: Token
  wrapperToken: Token
  reserveTokens: Token[]
  protocolTokens: AgaveProtocolTokens
  stakeToken: Token
  allTokens: TokenWithType[]
  allIncentivesTokens: TokenWithType[]
  getRelatedTokensByAddress: (tokenAddress: string) => TokenInfo[]
  getTokenByAddress: (tokenAddress: string) => TokenWithType
  getTokenByFieldAndValue: (
    fieldAndValue: Partial<RequiredFieldsOnly<Token>>,
  ) => TokenWithType | undefined
  getProtocolTokenInfo: (reserveAddress: string, type: AgaveProtocolTokenType) => Token
}

class AgaveTokens implements IDAgaveTokens {
  private _nativeToken: Token = nativeToken.tokens[0]
  private _stakeToken: Token = stakeToken.tokens[0]
  private _reserveTokens: Token[] = reserveTokens.tokens
  private _protocolTokens: AgaveProtocolTokens = protocolTokens.protocolTokens
  private _protocolName = 'Agave'
  private _validLookupFields: (keyof ValidLookupFields)[] = ['address', 'symbol', 'name']

  constructor() {
    // runtime check to prevent consuming invalid token info
    this.allTokens.every(this.isValidTokenInfo)
  }

  get nativeToken() {
    return this._nativeToken
  }

  get stakeToken() {
    return this._stakeToken
  }

  @memoize()
  get wrapperToken() {
    const nativeWrapper = this._reserveTokens.find(
      ({ extensions: { isNativeWrapper } }) => isNativeWrapper,
    )

    if (!nativeWrapper) {
      throw new Error('Native wrapper must be defined')
    }

    return nativeWrapper
  }

  get reserveTokens() {
    return this._reserveTokens
  }

  get protocolTokens() {
    return this._protocolTokens
  }

  @memoize()
  get allTokens(): TokenWithType[] {
    return [
      {
        ...this.stakeToken,
        type: 'stake',
      },
      {
        ...this.nativeToken,
        type: 'native',
      },
      ...this.reserveTokens.map(
        (tokenInfo): TokenWithType => ({
          ...tokenInfo,
          type: 'reserve',
        }),
      ),
      ...Object.values(this.reserveTokens).flatMap(({ address }): TokenWithType[] => {
        return [
          { ...this.getProtocolTokenInfo(address, 'ag'), type: 'ag' },
          {
            ...this.getProtocolTokenInfo(address, 'variableDebt'),
            type: 'variableDebt',
          },
          {
            ...this.getProtocolTokenInfo(address, 'stableDebt'),
            type: 'stableDebt',
          },
        ]
      }),
    ]
  }

  @memoize()
  get allIncentivesTokens(): TokenWithType[] {
    return this.allTokens.filter(({ type }) => ['ag', 'variableDebt'].includes(type))
  }

  @memoize()
  getRelatedTokensByAddress(tokenAddress: string): TokenInfo[] {
    const tokenInfo = this.getTokenByAddress(tokenAddress)

    if (tokenInfo.type === 'reserve') {
      // discard `oracle`, `strategy`, and `symbol` from protocol tokens
      const { oracle, strategy, symbol, ...protocolTokens } = this.getProtocolTokensByReserve(
        tokenInfo.address,
      )

      return [
        {
          address: tokenInfo.address,
          symbol: tokenInfo.symbol,
          type: tokenInfo.type,
        },
        ...Object.values(protocolTokens)
          .map(this.getTokenByAddress.bind(this))
          .map(({ address, symbol, type }) => ({
            address,
            symbol,
            type,
          })),
      ]
    } else {
      const reserveToken = this.getReserveTokenByAddress(tokenAddress)

      if (!reserveToken) {
        throw Error(`Unsupported token: ${tokenAddress}`)
      }

      return this.getRelatedTokensByAddress(reserveToken.address)
    }
  }

  @memoize()
  getTokenByAddress(tokenAddress: string): TokenWithType {
    const tokenInfo = this.getTokenByFieldAndValue({ address: tokenAddress })

    if (!tokenInfo) {
      throw Error(`Unsupported token: ${tokenAddress}`)
    }

    return tokenInfo
  }

  @memoize()
  getTokenByFieldAndValue(fieldAndValue: Partial<RequiredFieldsOnly<Token>>): TokenWithType {
    const [field, value] = Object.entries(fieldAndValue)[0]

    if (!field || !value) {
      throw new Error('field and value are required')
    }

    if (!this._validLookupFields.some((validField) => validField === field)) {
      throw new Error(`Invalid field: ${field}`)
    }

    let foundToken: TokenWithType | undefined

    if (field === 'address') {
      foundToken = this.allTokens.find((token) => isSameAddress(token[field], value))
    } else {
      foundToken = this.allTokens.find(
        (token) => token[field].toLowerCase() === value.toLowerCase(),
      )
    }

    if (!foundToken) {
      throw Error(`Unsupported token: ${field} ${value}`)
    }

    return foundToken
  }

  @memoize()
  private getReserveTokenByAddress(tokenAddress: string): Token {
    // lookup reserve token by reserve address
    const tokenInfo = this._reserveTokens.find((token) =>
      isSameAddress(token.address, tokenAddress),
    )

    // if not found, lookup reserve token by protocol token address
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
        throw Error(`Unsupported token: ${tokenAddress}`)
      }

      const [reserveAddress] = foundToken

      return this.getReserveTokenByAddress(reserveAddress)
    }

    return tokenInfo
  }

  private getProtocolTokensByReserve(
    reserveAddress: string,
  ): AgaveProtocolTokens['reserveAddress'] {
    const foundToken = Object.entries(this._protocolTokens).find(([address]) =>
      isSameAddress(address, reserveAddress),
    )

    if (!foundToken) {
      throw Error(`Unsupported reserveAddress token: ${reserveAddress}`)
    }

    const [, protocolTokens] = foundToken

    return protocolTokens
  }

  @memoize()
  getProtocolTokenInfo(reserveAddress: string, tokenType: AgaveProtocolTokenType): Token {
    const tokenInfo = this.getReserveTokenByAddress(reserveAddress)
    const protocolTokens = this.getProtocolTokensByReserve(reserveAddress)
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
        throw new Error(`Unsupported token type: ${tokenType}`)
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

    if (
      tokenInfo.extensions.isNative === undefined ||
      tokenInfo.extensions.isNativeWrapper === undefined
    ) {
      throw new Error('Token extensions.isNative and extensions.isNativeWrapper are required')
    }

    return true
  }
}

export const agaveTokens = new AgaveTokens()

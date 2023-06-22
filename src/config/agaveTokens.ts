import nativeToken from '@/public/nativeToken.json'
import reserveTokensBoosted from '@/public/reserveTokensBoosted.json'
import reserveTokensMain from '@/public/reserveTokensMain.json'
import stakeToken from '@/public/stakeToken.json'
import { MarketVersions } from '@/src/contracts/contracts'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { memoize } from '@/src/utils/memoize'
import { Token } from '@/types/token'
import { RequiredFieldsOnly } from '@/types/utils'

export type AgaveProtocolTokens = {
  [reserve: string]: {
    ag: string
    variableDebt: string
    stableDebt: string
    wag: string
  }
}

export type AgaveProtocolTokenStrictType = 'ag' | 'variableDebt' | 'stableDebt' | 'wag'

export type AgaveProtocolTokenType =
  | 'ag'
  | 'variableDebt'
  | 'stableDebt'
  | 'reserve'
  | 'native'
  | 'stake'
  | 'wag'

export type TokenWithType = Token & { type: AgaveProtocolTokenType }

export type TokenInfo = Pick<TokenWithType, 'address' | 'symbol' | 'type'>

type ValidLookupFields = Pick<Token, 'address' | 'symbol' | 'name'>

export interface IDAgaveTokens {
  nativeToken: Token
  wrapperToken: Token
  reserveTokens: Token[]
  allTokens: TokenWithType[]
  allIncentivesTokens: TokenWithType[]
  getRelatedTokensByAddress: (tokenAddress: string) => TokenInfo[]
  getTokenByAddress: (tokenAddress: string) => TokenWithType
  getTokenByFieldAndValue: (
    fieldAndValue: Partial<RequiredFieldsOnly<Token>>,
  ) => TokenWithType | undefined
  getProtocolTokenInfo: (reserveAddress: string, type: AgaveProtocolTokenType) => Token
}

const getReserveTokensByMarketVersion = (marketVersion: MarketVersions) => {
  switch (marketVersion) {
    case MarketVersions.boosted:
      return reserveTokensBoosted.tokens
    default:
      return reserveTokensMain.tokens
  }
}

class AgaveTokens implements IDAgaveTokens {
  private _reserveTokens: Token[]
  private _protocolName = 'Agave'
  private _chainId = 100 // gnosis chain as default
  private _validLookupFields: (keyof ValidLookupFields)[] = ['address', 'symbol', 'name']
  private readonly _marketVersion: MarketVersions

  constructor(marketVersion: MarketVersions) {
    this._marketVersion = marketVersion
    this._reserveTokens = getReserveTokensByMarketVersion(marketVersion)

    // runtime check to prevent consuming invalid token info
    this.allTokens.every(this.isValidTokenInfo)
  }

  get marketVersion(): MarketVersions {
    return this._marketVersion
  }

  set chainId(chainId: number) {
    this._chainId = chainId
  }

  get chainId() {
    return this._chainId
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

  get nativeToken() {
    return nativeToken.tokens.filter(({ chainId }) => chainId === this._chainId)[0]
  }

  get stakeToken() {
    return stakeToken.tokens.filter(({ chainId }) => chainId === this._chainId)[0]
  }

  get reserveTokens() {
    return this._reserveTokens.filter(({ chainId }) => chainId === this._chainId)
  }

  get allTokens(): TokenWithType[] {
    return [
      ...this.reserveTokens.map(
        (tokenInfo): TokenWithType => ({
          ...tokenInfo,
          type: 'reserve',
        }),
      ),
      {
        ...this.nativeToken,
        type: 'native',
      },
      {
        ...this.stakeToken,
        type: 'stake',
      },
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
          { ...this.getProtocolTokenInfo(address, 'wag'), type: 'wag' },
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
      const protocolTokens = this.getProtocolTokensByReserve(tokenInfo.address)

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
      throw Error(
        `Unsupported token: ${field} ${value} for selected market version ${this._marketVersion}`,
      )
    }

    return foundToken
  }

  @memoize()
  private getReserveTokenByAddress(tokenAddress: string): Token {
    // lookup reserve token by reserve address
    for (let i = 0; i < this.reserveTokens.length; i++) {
      const token = this.reserveTokens[i]
      if (isSameAddress(token.address, tokenAddress)) {
        return token
      }

      if (!token.extensions.protocolTokens) {
        continue
      }

      // if not found, lookup reserve token by protocol token address
      for (const tokenType in token.extensions.protocolTokens) {
        if (
          isSameAddress(
            token.extensions.protocolTokens[tokenType as AgaveProtocolTokenStrictType],
            tokenAddress,
          )
        ) {
          return token
        }
      }
    }

    throw Error(`Unsupported token: ${tokenAddress}`)
  }

  @memoize()
  private getProtocolTokensByReserve(
    reserveAddress: string,
  ): AgaveProtocolTokens['reserveAddress'] {
    const foundToken = this.reserveTokens.find(({ address }) =>
      isSameAddress(address, reserveAddress),
    )

    if (!foundToken || !foundToken.extensions.protocolTokens) {
      throw Error(`Unsupported reserveAddress token: ${reserveAddress}`)
    }

    return foundToken.extensions.protocolTokens
  }

  @memoize()
  getProtocolTokenInfo(reserveAddress: string, tokenType: AgaveProtocolTokenType): Token {
    const tokenInfo = this.getReserveTokenByAddress(reserveAddress)
    const protocolTokens = this.getProtocolTokensByReserve(reserveAddress)

    switch (tokenType) {
      case 'ag':
        return {
          ...tokenInfo,
          extensions: {
            ...tokenInfo.extensions,
            protocolTokens: undefined, // remove protocol tokens from extensions
          },
          address: protocolTokens.ag,
          name: `${this._protocolName} interest bearing ${tokenInfo.symbol}`,
          symbol: `ag${tokenInfo.symbol}`,
        }
      case 'variableDebt':
        return {
          ...tokenInfo,
          extensions: {
            ...tokenInfo.extensions,
            protocolTokens: undefined, // remove protocol tokens from extensions
          },
          address: protocolTokens.variableDebt,
          name: `${this._protocolName} variable debt bearing ${tokenInfo.symbol}`,
          symbol: `variableDebt${tokenInfo.symbol}`,
        }
      case 'stableDebt':
        return {
          ...tokenInfo,
          extensions: {
            ...tokenInfo.extensions,
            protocolTokens: undefined, // remove protocol tokens from extensions
          },
          address: protocolTokens.stableDebt,
          name: `${this._protocolName} stable debt bearing ${tokenInfo.symbol}`,
          symbol: `stableDebt${tokenInfo.symbol}`,
        }
      case 'wag': {
        return {
          ...tokenInfo,
          extensions: {
            ...tokenInfo.extensions,
            protocolTokens: undefined, // remove protocol tokens from extensions
          },
          address: protocolTokens.wag,
          name: `Wrapped ${this._protocolName} interest bearing ${tokenInfo.symbol}`,
          symbol: `wag${tokenInfo.symbol}`,
        }
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

export default AgaveTokens

export const agaveTokensMain = new AgaveTokens(MarketVersions.main)
export const agaveTokensBoosted = new AgaveTokens(MarketVersions.boosted)

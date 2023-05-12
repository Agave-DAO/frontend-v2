import { agaveTokensMain } from './agaveTokens'
import { TokenListResponse } from '@/types/token'

jest.mock('@/public/reserveTokensMain.json', (): Pick<TokenListResponse, 'tokens'> => {
  return {
    tokens: [
      {
        address: `0x0000000000000000000000000000000000000010`,
        name: `Test Token 1`,
        symbol: `TT1`,
        decimals: 18,
        chainId: 100,
        logoURI: `/coins/tt1.png`,
        extensions: {
          isNative: false,
          isNativeWrapper: false,
          protocolTokens: {
            ag: '0x0000000000000000000000000000000000000011',
            variableDebt: '0x0000000000000000000000000000000000000012',
            stableDebt: '0x0000000000000000000000000000000000000013',
          },
        },
      },
      {
        address: `0x0000000000000000000000000000000000000020`,
        name: `Test Token 2`,
        symbol: `TT2`,
        decimals: 18,
        chainId: 100,
        logoURI: `/coins/tt2.png`,
        extensions: {
          isNative: false,
          isNativeWrapper: false,
          protocolTokens: {
            ag: '0x0000000000000000000000000000000000000021',
            variableDebt: '0x0000000000000000000000000000000000000022',
            stableDebt: '0x0000000000000000000000000000000000000023',
          },
        },
      },
    ],
  }
})

describe('AgaveTokens', () => {
  it('returns all protocol tokens', () => {
    const allTokens = agaveTokensMain.allTokens

    expect(allTokens.length).toEqual(10)
  })

  it('returns all incentives tokens', () => {
    const allIncentivesTokens = agaveTokensMain.allIncentivesTokens

    expect(allIncentivesTokens.length).toEqual(4)
    expect(allIncentivesTokens).toEqual([
      {
        address: '0x0000000000000000000000000000000000000011',
        name: 'Agave interest bearing TT1',
        symbol: 'agTT1',
        decimals: 18,
        chainId: 100,
        logoURI: '/coins/tt1.png',
        type: 'ag',
        extensions: {
          isNative: false,
          isNativeWrapper: false,
        },
      },
      {
        address: '0x0000000000000000000000000000000000000012',
        name: 'Agave variable debt bearing TT1',
        symbol: 'variableDebtTT1',
        decimals: 18,
        chainId: 100,
        logoURI: '/coins/tt1.png',
        type: 'variableDebt',
        extensions: {
          isNative: false,
          isNativeWrapper: false,
        },
      },
      {
        address: '0x0000000000000000000000000000000000000021',
        name: 'Agave interest bearing TT2',
        symbol: 'agTT2',
        decimals: 18,
        chainId: 100,
        logoURI: '/coins/tt2.png',
        type: 'ag',
        extensions: {
          isNative: false,
          isNativeWrapper: false,
        },
      },
      {
        address: '0x0000000000000000000000000000000000000022',
        name: 'Agave variable debt bearing TT2',
        symbol: 'variableDebtTT2',
        decimals: 18,
        chainId: 100,
        logoURI: '/coins/tt2.png',
        type: 'variableDebt',
        extensions: {
          isNative: false,
          isNativeWrapper: false,
        },
      },
    ])
  })

  it('returns all reserve tokens', () => {
    const reserveTokens = agaveTokensMain.reserveTokens

    expect(reserveTokens.length).toEqual(2)
  })

  it('returns related tokens info by reserve address', () => {
    const relatedTokens = agaveTokensMain.getRelatedTokensByAddress(
      '0x0000000000000000000000000000000000000010',
    )

    expect(relatedTokens).toEqual([
      {
        address: '0x0000000000000000000000000000000000000010',
        symbol: 'TT1',
        type: 'reserve',
      },
      {
        address: '0x0000000000000000000000000000000000000011',
        symbol: 'agTT1',
        type: 'ag',
      },
      {
        address: '0x0000000000000000000000000000000000000012',
        symbol: 'variableDebtTT1',
        type: 'variableDebt',
      },
      {
        address: '0x0000000000000000000000000000000000000013',
        symbol: 'stableDebtTT1',
        type: 'stableDebt',
      },
    ])
  })

  it('returns related tokens info by protocol token address', () => {
    const relatedTokens = agaveTokensMain.getRelatedTokensByAddress(
      '0x0000000000000000000000000000000000000011',
    )

    expect(relatedTokens).toEqual([
      {
        address: '0x0000000000000000000000000000000000000010',
        symbol: 'TT1',
        type: 'reserve',
      },
      {
        address: '0x0000000000000000000000000000000000000011',
        symbol: 'agTT1',
        type: 'ag',
      },
      {
        address: '0x0000000000000000000000000000000000000012',
        symbol: 'variableDebtTT1',
        type: 'variableDebt',
      },
      {
        address: '0x0000000000000000000000000000000000000013',
        symbol: 'stableDebtTT1',
        type: 'stableDebt',
      },
    ])
  })

  it('throws error if token is not supported', () => {
    expect(() =>
      agaveTokensMain.getRelatedTokensByAddress('0x000000000000000000000000000000000000000a'),
    ).toThrowError('Unsupported token')
  })

  it('returns token info by address', () => {
    const tokenInfo = agaveTokensMain.getTokenByAddress(
      '0x0000000000000000000000000000000000000010',
    )

    expect(tokenInfo).toEqual({
      address: `0x0000000000000000000000000000000000000010`,
      name: `Test Token 1`,
      symbol: `TT1`,
      decimals: 18,
      chainId: 100,
      logoURI: `/coins/tt1.png`,
      type: `reserve`,
      extensions: {
        isNative: false,
        isNativeWrapper: false,
        protocolTokens: {
          ag: '0x0000000000000000000000000000000000000011',
          variableDebt: '0x0000000000000000000000000000000000000012',
          stableDebt: '0x0000000000000000000000000000000000000013',
        },
      },
    })
  })

  it('returns token info by symbol', () => {
    const tokenInfo = agaveTokensMain.getTokenByFieldAndValue({ symbol: 'TT1' })

    expect(tokenInfo).toEqual({
      address: `0x0000000000000000000000000000000000000010`,
      name: `Test Token 1`,
      symbol: `TT1`,
      decimals: 18,
      chainId: 100,
      logoURI: `/coins/tt1.png`,
      type: `reserve`,
      extensions: {
        isNative: false,
        isNativeWrapper: false,
        protocolTokens: {
          ag: '0x0000000000000000000000000000000000000011',
          variableDebt: '0x0000000000000000000000000000000000000012',
          stableDebt: '0x0000000000000000000000000000000000000013',
        },
      },
    })

    const agTokenInfo = agaveTokensMain.getTokenByFieldAndValue({ symbol: 'agTT1' })

    expect(agTokenInfo).toEqual({
      address: `0x0000000000000000000000000000000000000011`,
      name: `Agave interest bearing TT1`,
      symbol: `agTT1`,
      decimals: 18,
      chainId: 100,
      logoURI: `/coins/tt1.png`,
      type: `ag`,
      extensions: {
        isNative: false,
        isNativeWrapper: false,
      },
    })
  })

  it('returns `undefined` if token by field is not found', () => {
    expect(() => agaveTokensMain.getTokenByFieldAndValue({ symbol: 'TT3' })).toThrowError(
      'Unsupported token',
    )
  })

  it('throws error if field is not supported', () => {
    expect(() => agaveTokensMain.getTokenByFieldAndValue({ decimal: 1 })).toThrowError()
  })

  it('finds reserve token info by searching by a protocol token address', () => {
    const agTokenAddress = '0x0000000000000000000000000000000000000011'

    const reserveToken = agaveTokensMain
      .getRelatedTokensByAddress(agTokenAddress)
      .find(({ type }) => type === 'reserve')

    if (reserveToken) {
      const reserveTokenInfo = agaveTokensMain.getTokenByAddress(reserveToken.address)

      expect(reserveTokenInfo).toEqual({
        address: `0x0000000000000000000000000000000000000010`,
        name: `Test Token 1`,
        symbol: `TT1`,
        decimals: 18,
        chainId: 100,
        logoURI: `/coins/tt1.png`,
        type: `reserve`,
        extensions: {
          isNative: false,
          isNativeWrapper: false,
          protocolTokens: {
            ag: '0x0000000000000000000000000000000000000011',
            variableDebt: '0x0000000000000000000000000000000000000012',
            stableDebt: '0x0000000000000000000000000000000000000013',
          },
        },
      })
    }
  })
})

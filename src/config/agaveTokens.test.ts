import { AgaveProtocolTokens, agaveTokens } from './agaveTokens'
import { TokenListResponse } from '@/types/token'

jest.mock('@/public/underlyingTokens.json', (): Pick<TokenListResponse, 'tokens'> => {
  return {
    tokens: [
      {
        address: `0x0000000000000000000000000000000000000010`,
        name: `Test Token 1`,
        symbol: `TT1`,
        decimals: 18,
        chainId: 100,
        logoURI: `/coins/tt1.png`,
      },
      {
        address: `0x0000000000000000000000000000000000000020`,
        name: `Test Token 2`,
        symbol: `TT2`,
        decimals: 18,
        chainId: 100,
        logoURI: `/coins/tt2.png`,
      },
    ],
  }
})

jest.mock('@/public/protocolTokens.json', (): { protocolTokens: AgaveProtocolTokens } => {
  return {
    protocolTokens: {
      '0x0000000000000000000000000000000000000010': {
        symbol: 'TT1',
        ag: '0x0000000000000000000000000000000000000011',
        variableDebt: '0x0000000000000000000000000000000000000012',
        stableDebt: '0x0000000000000000000000000000000000000013',
        strategy: '0x0000000000000000000000000000000000000014',
        oracle: '0x0000000000000000000000000000000000000015',
      },
      '0x0000000000000000000000000000000000000020': {
        symbol: 'TT2',
        ag: '0x0000000000000000000000000000000000000021',
        variableDebt: '0x0000000000000000000000000000000000000022',
        stableDebt: '0x0000000000000000000000000000000000000023',
        strategy: '0x0000000000000000000000000000000000000024',
        oracle: '0x0000000000000000000000000000000000000025',
      },
    },
  }
})

describe('AgaveTokens', () => {
  it('returns all protocol tokens', () => {
    const allTokens = agaveTokens.allTokens

    expect(allTokens.length).toEqual(8)
  })

  it('returns all underlying tokens', () => {
    const underlyingTokens = agaveTokens.underlyingTokens

    expect(underlyingTokens.length).toEqual(2)
  })

  it('returns all protocol tokens grouped by underlying', () => {
    const protocolTokens = agaveTokens.protocolTokens

    expect(protocolTokens).toEqual({
      '0x0000000000000000000000000000000000000010': {
        symbol: 'TT1',
        ag: '0x0000000000000000000000000000000000000011',
        variableDebt: '0x0000000000000000000000000000000000000012',
        stableDebt: '0x0000000000000000000000000000000000000013',
        strategy: '0x0000000000000000000000000000000000000014',
        oracle: '0x0000000000000000000000000000000000000015',
      },
      '0x0000000000000000000000000000000000000020': {
        symbol: 'TT2',
        ag: '0x0000000000000000000000000000000000000021',
        variableDebt: '0x0000000000000000000000000000000000000022',
        stableDebt: '0x0000000000000000000000000000000000000023',
        strategy: '0x0000000000000000000000000000000000000024',
        oracle: '0x0000000000000000000000000000000000000025',
      },
    })
  })

  it('returns related tokens info by underlying address', () => {
    const relatedTokens = agaveTokens.getRelatedTokensByAddress(
      '0x0000000000000000000000000000000000000010',
    )

    expect(relatedTokens).toEqual([
      {
        address: '0x0000000000000000000000000000000000000010',
        symbol: 'TT1',
        type: 'underlying',
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
    const relatedTokens = agaveTokens.getRelatedTokensByAddress(
      '0x0000000000000000000000000000000000000011',
    )

    expect(relatedTokens).toEqual([
      {
        address: '0x0000000000000000000000000000000000000010',
        symbol: 'TT1',
        type: 'underlying',
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
      agaveTokens.getRelatedTokensByAddress('0x000000000000000000000000000000000000000a'),
    ).toThrowError('Unsupported token')
  })

  it('returns token info by address', () => {
    const tokenInfo = agaveTokens.getTokenByAddress('0x0000000000000000000000000000000000000010')

    expect(tokenInfo).toEqual({
      address: `0x0000000000000000000000000000000000000010`,
      name: `Test Token 1`,
      symbol: `TT1`,
      decimals: 18,
      chainId: 100,
      logoURI: `/coins/tt1.png`,
      type: `underlying`,
    })
  })

  it('returns token info by symbol', () => {
    const tokenInfo = agaveTokens.getTokenByFieldAndValue({ symbol: 'TT1' })

    expect(tokenInfo).toEqual({
      address: `0x0000000000000000000000000000000000000010`,
      name: `Test Token 1`,
      symbol: `TT1`,
      decimals: 18,
      chainId: 100,
      logoURI: `/coins/tt1.png`,
      type: `underlying`,
    })

    const agTokenInfo = agaveTokens.getTokenByFieldAndValue({ symbol: 'agTT1' })

    expect(agTokenInfo).toEqual({
      address: `0x0000000000000000000000000000000000000011`,
      name: `Agave interest bearing TT1`,
      symbol: `agTT1`,
      decimals: 18,
      chainId: 100,
      logoURI: `/coins/tt1.png`,
      type: `ag`,
    })
  })

  it('returns `undefined` if token by field is not found', () => {
    const tokenInfo = agaveTokens.getTokenByFieldAndValue({ symbol: 'TT3' })

    expect(tokenInfo).toBeUndefined()
  })

  it('throws error if field is not supported', () => {
    expect(() => agaveTokens.getTokenByFieldAndValue({ decimal: 1 })).toThrowError()
  })

  it('finds underlying token info by searching by a protocol token address', () => {
    const agTokenAddress = '0x0000000000000000000000000000000000000011'

    const underlyingToken = agaveTokens
      .getRelatedTokensByAddress(agTokenAddress)
      .find(({ type }) => type === 'underlying')

    if (underlyingToken) {
      const underlyingTokenInfo = agaveTokens.getTokenByAddress(underlyingToken.address)

      expect(underlyingTokenInfo).toEqual({
        address: `0x0000000000000000000000000000000000000010`,
        name: `Test Token 1`,
        symbol: `TT1`,
        decimals: 18,
        chainId: 100,
        logoURI: `/coins/tt1.png`,
        type: `underlying`,
      })
    }
  })
})

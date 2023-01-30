import { getTokenInfo } from './getTokenInfo'
import { AgaveProtocolTokens } from '@/src/config/agaveTokens'
import { TokenListResponse } from '@/types/token'

jest.mock('@/public/reserveTokens.json', (): Pick<TokenListResponse, 'tokens'> => {
  return {
    tokens: [
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

describe('getTokenInfo', () => {
  it('returns the token info for a given token address', async () => {
    const tokenInfo = await getTokenInfo('0x0000000000000000000000000000000000000022')
    expect(tokenInfo).toEqual({
      address: '0x0000000000000000000000000000000000000022',
      name: 'Agave variable debt bearing TT2',
      symbol: 'variableDebtTT2',
      decimals: 18,
      chainId: 100,
      logoURI: '/coins/tt2.png',
      type: 'variableDebt',
    })
  })

  it('returns the token info for a given token symbol', async () => {
    const tokenInfo = await getTokenInfo('variableDebtTT2')
    expect(tokenInfo).toEqual({
      address: '0x0000000000000000000000000000000000000022',
      name: 'Agave variable debt bearing TT2',
      symbol: 'variableDebtTT2',
      decimals: 18,
      chainId: 100,
      logoURI: '/coins/tt2.png',
      type: 'variableDebt',
    })
  })

  it('throws an error if the token address is not found', async () => {
    await expect(() => getTokenInfo('0x0000000000000000000000000000000000000000')).toThrowError(
      'Unsupported token',
    )
  })

  it('throws an error if the token symbol is not found', async () => {
    await expect(() => getTokenInfo('variableDebtTT0')).toThrowError('Unsupported token')
  })
})

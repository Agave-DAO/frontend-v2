import { BigNumber } from '@ethersproject/bignumber'

import { getIncentiveRate } from './markets'
import { AgaveProtocolTokens, agaveTokens } from '@/src/config/agaveTokens'
import { TokenListResponse } from '@/types/token'

jest.mock('@/public/reserveTokens.json', (): Pick<TokenListResponse, 'tokens'> => {
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
        },
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
    },
  }
})

const { decimals } = agaveTokens.reserveTokens[0] // get first token of the token reserves array

const mockPriceShare = BigNumber.from(((1.5 / 12.5) * 1e16).toFixed())

describe('getIncentiveRate', () => {
  it('getIncentiveRate should return expected output', () => {
    const mockParams = {
      tokenSupply: BigNumber.from('15000000000000000000'),
      emissionPerSeconds: BigNumber.from('10'),
      priceShares: mockPriceShare,
      tokenPrice: BigNumber.from('1500000000000000000'),
      decimals,
    }

    expect(getIncentiveRate(mockParams).toString()).toBe('16819000000')
  })
})

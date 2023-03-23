import { BigNumber } from '@ethersproject/bignumber'

import { getIncentiveRate, getMarketSize, getPriceShares } from './markets'
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

const { address: tokenAddress } = agaveTokens.reserveTokens[0] // get first token of the token reserves array

const mockPriceShare = BigNumber.from(((1.5 / 12.5) * 1e16).toFixed())

describe('getMarketSize', () => {
  it('getMarketSize should return expected output', () => {
    const mockParams = {
      totalSupply: BigNumber.from('15000000000000000000'),
      price: BigNumber.from('1500000000000000000'),
      tokenAddress,
    }

    expect(getMarketSize(mockParams).toString()).toBe('22500000000000000000')
  })
})

describe('getPriceShares', () => {
  it('getPriceShares should return expected output', () => {
    const mockParams = {
      liquidity: '1.5',
      totalShares: '12.5',
    }
    const mockParamsWithDenominatorZero = {
      liquidity: '1.5',
      totalShares: '0',
    }

    expect(getPriceShares(mockParams).toString()).toBe('1200000000000000')
    expect(getPriceShares(mockParamsWithDenominatorZero).toString()).toBe('0')
  })
})

describe('getIncentiveRate', () => {
  it('getIncentiveRate should return expected output', () => {
    const mockParams = {
      tokenSupply: BigNumber.from('15000000000000000000'),
      emissionPerSeconds: BigNumber.from('10'),
      priceShares: mockPriceShare,
      tokenPrice: BigNumber.from('1500000000000000000'),
      tokenAddress,
    }

    expect(getIncentiveRate(mockParams).toString()).toBe('1681900000000000')
  })
})

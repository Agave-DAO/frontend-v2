import { BigNumber } from '@ethersproject/bignumber'

import { formatAmount, formatNumber, formatPercentage, weiPerToken } from './common'

describe('formatNumber', () => {
  it('should expose a function', () => {
    expect(formatNumber).toBeDefined()
  })

  it('formatNumber should return expected output', () => {
    const retValue = formatNumber(150000.356, 2)

    expect(retValue).toBe('150,000.36')
  })
})

describe('formatAmount', () => {
  it('should expose a function', () => {
    expect(formatAmount).toBeDefined()
  })

  it('formatAmount should return expected outputs', () => {
    const mockValue = BigNumber.from('22500000000000000000') // 22.5 ETH
    const mockDecimals = 18
    const mockSymbol = 'ETH'

    const retValueWithSymbolBefore = formatAmount(mockValue, mockDecimals, mockSymbol, 'before')
    const retValueWithSymbolAfter = formatAmount(mockValue, mockDecimals, mockSymbol, 'after')
    const retValueWithDefaultSymbolAndDefaultPosition = formatAmount(mockValue, mockDecimals)
    const retValueWithoutSymbol = formatAmount(mockValue, mockDecimals, '')

    expect(retValueWithSymbolBefore).toBe('ETH 22.5')
    expect(retValueWithSymbolAfter).toBe('22.5 ETH')
    expect(retValueWithDefaultSymbolAndDefaultPosition).toBe('$ 22.5')
    expect(retValueWithoutSymbol).toBe('22.5')
  })
})
describe('formatPercentage', () => {
  it('should expose a function', () => {
    expect(formatPercentage).toBeDefined()
  })

  it('formatPercentage should return expected output', () => {
    const mockValue = BigNumber.from('22500000000000000000') // 22.5 ETH
    const mockDecimals = 18

    const retValue = formatPercentage(mockValue, mockDecimals)
    expect(retValue).toBe('22.5 %')
  })
})

describe('weiPerToken', () => {
  it('should expose a function', () => {
    expect(weiPerToken).toBeDefined()
  })

  it('weiPerToken should return expected output', () => {
    const retValue = weiPerToken(6)
    expect(retValue.toString()).toBe('1000000')
  })
})

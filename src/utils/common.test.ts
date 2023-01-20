import { BigNumber } from '@ethersproject/bignumber'

import { formatAmount, formatNumber, formatPercentage, fromWei, toWei } from './common'

describe('formatNumber', () => {
  it('formatNumber should return expected output', () => {
    const retValue = formatNumber(150000.356, 2)

    expect(retValue).toBe('150,000.36')
  })
})

describe('formatAmount', () => {
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
  it('formatPercentage should return expected output', () => {
    const mockValue = BigNumber.from('22500000000000000000') // 22.5 ETH
    const mockDecimals = 18

    const retValue = formatPercentage(mockValue, mockDecimals)
    expect(retValue).toBe('22.5%')
  })
})

describe('toWei', () => {
  it('fromWie should return expected output', () => {
    const mockValue = '22'
    const mockValueBN = BigNumber.from('22')
    const mockDecimals = 18

    const retValue = toWei(mockValue, mockDecimals)
    const retValueBN = toWei(mockValueBN, mockDecimals)
    expect(retValue.toString()).toBe('22000000000000000000')
    expect(retValueBN.toString()).toBe('22000000000000000000')
  })
})

describe('fromWei', () => {
  it('fromWei should return expected output', () => {
    const mockValue = '515096723460346549336314614912'
    const mockValueBN = BigNumber.from('515096723460346549336314614912')
    const mockDecimals = 6

    const retValue = fromWei(mockValue, mockDecimals)
    const retValueBN = fromWei(mockValueBN, mockDecimals)

    expect(retValue.toString()).toBe('515096723460346549336314')
    expect(retValueBN.toString()).toBe('515096723460346549336314')
  })
})

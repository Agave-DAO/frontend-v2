import { BigNumber } from '@ethersproject/bignumber'

import {
  calculatePercentageTimePassedBetweenDates,
  formatAmount,
  formatPercentage,
  fromWei,
  futureDateToCooldownPeriod,
  toWei,
} from './common'
import { secondsToString } from '@/src/utils/common'

describe('formatAmount', () => {
  it('formatAmount should return expected outputs', () => {
    const mockValue = BigNumber.from('22531146831900000000') // 22.5311468319 ETH
    const mockDecimals = 18
    const mockSymbol = 'ETH'

    const retValueWithSymbolBefore = formatAmount(mockValue, mockDecimals, mockSymbol, 'before')
    const retValueWithSymbolAfter = formatAmount(mockValue, mockDecimals, mockSymbol, 'after')
    const retValueWithDefaultSymbolAndDefaultPosition = formatAmount(
      mockValue,
      mockDecimals,
      mockSymbol,
      'before',
    )
    const retValueWithoutSymbol = formatAmount(mockValue, mockDecimals, mockSymbol, 'before')

    expect(retValueWithSymbolBefore).toBe('ETH 22.53')
    expect(retValueWithSymbolAfter).toBe('22.53 ETH')
    expect(retValueWithDefaultSymbolAndDefaultPosition).toBe('ETH 22.53')
    expect(retValueWithoutSymbol).toBe('ETH 22.53')
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
  it('toWei should return expected output', () => {
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

describe('SecondsToString', () => {
  it('SecondsToString should return expected output', () => {
    const mockValue10Sec = 10
    const mockValue10Min = 10 * 60
    const mockValue10Hours = 10 * 60 * 60
    const mockValue10Days = 10 * 60 * 60 * 24

    const retValue10Sec = secondsToString(mockValue10Sec)
    const retValue10Min = secondsToString(mockValue10Min)
    const retValue10Hours = secondsToString(mockValue10Hours)
    const retValue10Days = secondsToString(mockValue10Days)

    expect(retValue10Sec).toBe('10 seconds')
    expect(retValue10Min).toBe('10 minutes')
    expect(retValue10Hours).toBe('10 hours')
    expect(retValue10Days).toBe('10 days')
  })
})

describe('calculatePercentageTimePassedBetweenDates', () => {
  it('calculatePercentageTimePassedBetweenDates should return expected output', () => {
    const mockStartDate = new Date('2021-01-01T00:00:00Z') // 00 seconds
    const mockEndDate = new Date('2021-01-01T00:00:10Z') // 10 seconds
    const mockCurrentDate = new Date('2021-01-01T00:00:05Z') // 5 seconds

    const retValue = calculatePercentageTimePassedBetweenDates(
      mockStartDate,
      mockEndDate,
      mockCurrentDate,
    )

    expect(retValue).toBe(50)
  })
})

describe('futureDateToCooldownPeriod', () => {
  it('futureDateToCooldownPeriod should return expected output', () => {
    const mockFutureDate1 = new Date('2021-01-01T01:00:00Z') // 1 hour
    const mockFutureDate2 = new Date('2021-01-03T01:10:00Z') // 2 days, 1 hour, 10 minutes
    const mockCurrentDate = new Date('2021-01-01T00:00:00Z')

    const retValue1 = futureDateToCooldownPeriod(mockFutureDate1, mockCurrentDate)
    const retValue2 = futureDateToCooldownPeriod(mockFutureDate2, mockCurrentDate)

    expect(retValue1).toStrictEqual({ days: 0, hours: 1, minutes: 0 })
    expect(retValue2).toStrictEqual({ days: 2, hours: 1, minutes: 10 })
  })
})

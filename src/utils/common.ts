import { BigNumber, FixedNumber } from '@ethersproject/bignumber'

import { DISPLAY_DECIMALS, NATIVE_DECIMALS } from '@/src/constants/common'

export const formatNumber = (value: number, displayDecimals = DISPLAY_DECIMALS): string =>
  value !== undefined
    ? Intl.NumberFormat('en', {
        maximumFractionDigits: displayDecimals,
      }).format(value)
    : ''

/**
 * It takes a BigNumber, converts it to a FixedNumber, and then formats it as a string
 * @param {BigNumber} value - The amount to format
 * @param {number} decimals - The number of decimals to display.
 * @param [symbol=$] - The symbol to use for the currency.
 * @param {'before' | 'after'} [symbolPosition=before] - 'before' | 'after' = 'before'
 */
export type SymbolPosition = 'before' | 'after'
export const formatAmount = (
  value: BigNumber,
  decimals: number = NATIVE_DECIMALS,
  symbol = '$',
  symbolPosition: SymbolPosition = 'before',
): string =>
  `${symbolPosition === 'before' ? `${symbol} ` : ''}${formatNumber(
    FixedNumber.fromValue(value, decimals).toUnsafeFloat(),
  )}${symbolPosition === 'after' ? ` ${symbol} ` : ''}`

export const formatPercentage = (value: BigNumber, decimals: number) =>
  `${FixedNumber.fromValue(value, decimals, 'fixed256x27')
    .toUnsafeFloat()
    .toFixed(DISPLAY_DECIMALS)} %`

export const weiPerToken = (decimals: number) => BigNumber.from(10).pow(decimals)

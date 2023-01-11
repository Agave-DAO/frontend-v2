import { BigNumber, FixedNumber } from '@ethersproject/bignumber'

import { DAI_DECIMALS } from '../constants/common'

const DISPLAY_DECIMALS = 3

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
export const formatAmount = (
  value: BigNumber,
  decimals: number = DAI_DECIMALS,
  symbol = '$',
  symbolPosition: 'before' | 'after' = 'before',
): string =>
  `${symbolPosition === 'before' ? `${symbol} ` : ''}${formatNumber(
    FixedNumber.fromValue(value, decimals).toUnsafeFloat(),
  )}${symbolPosition === 'after' ? ` ${symbol} ` : ''}`

export const formatPercentage = (value: BigNumber, decimals: number) =>
  `${FixedNumber.fromValue(value, decimals, 'fixed128x27')
    .toUnsafeFloat()
    .toFixed(DISPLAY_DECIMALS)} %`

import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { parseUnits } from 'ethers/lib/utils'

import { DISPLAY_DECIMALS, NATIVE_DECIMALS } from '@/src/constants/common'

/**
 * It takes a number and returns a formatted number as string
 * @param {number} value - number - The number to format
 * @param displayDecimals - The number of decimal places to display.
 */
export const formatNumber = (value: number, displayDecimals = DISPLAY_DECIMALS): string =>
  value !== undefined
    ? Intl.NumberFormat('en', {
        maximumFractionDigits: displayDecimals,
      }).format(value)
    : ''

/**
 * It takes a BigNumber and formats it as a string
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
  symbol
    ? `${symbolPosition === 'before' ? `${symbol} ` : ''}${formatNumber(
        FixedNumber.fromValue(value, decimals).toUnsafeFloat(),
      )}${symbolPosition === 'after' ? ` ${symbol}` : ''}`
    : `${formatNumber(FixedNumber.fromValue(value, decimals).toUnsafeFloat())}`

export const formatPercentage = (value: BigNumber, decimals: number) =>
  `${parseFloat(
    FixedNumber.fromValue(value, decimals, 'fixed256x27').toUnsafeFloat().toFixed(DISPLAY_DECIMALS),
  )}%`

/**
 * Convert all wei values to a BigNumber as human readable form
 * @param {string | BigNumber} value - The value in wei you want to convert.
 * @param [decimals=18] - The number of decimals the token has.
 * @returns A BigNumber object
 */
export function fromWei(value: string | BigNumber, decimals = 18) {
  const hasDecimals =
    value instanceof BigNumber ? false : value.split('.')[1]?.length ? true : false

  if (hasDecimals) {
    throw new Error("Wei value mustn't have decimal places")
  }

  if (typeof value === 'string') {
    return BigNumber.from(value).div(parseUnits('1', decimals))
  }

  return value.div(parseUnits('1', decimals))
}

/**
 * Convert non wei values to wei
 * @param {string | BigNumber } value - The number you want to convert to wei.
 * @param [decimals=18] - The number of decimals the token has.
 * @returns A BigNumber object
 */
export function toWei(value: string | BigNumber, decimals = 18) {
  if (typeof value === 'string') {
    return parseUnits(value, decimals)
  }
  return parseUnits(value.toString(), decimals)
}

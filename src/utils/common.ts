import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

const DISPLAY_DECIMALS_PRICE = 2
const DISPLAY_DECIMALS_AMOUNT = 4

export const formatAmount = (
  value: BigNumberish,
  symbol: string,
  decimals: number,
  symbolPosition: 'before' | 'after',
): string =>
  `${symbolPosition === 'before' ? `${symbol} ` : ''}${formatUnits(value, decimals)}${
    symbolPosition === 'after' ? ` ${symbol} ` : ''
  }`

/**
 * Returns an object with the raw value and a formatted
 * value
 * @param {decimals}  - `decimals` - the number of decimals the token has
 * @param {value}  - `value` - BigNumber instance
 */
type FormatValueParams = { decimals: number; value: BigNumber; symbol?: string }
export const rawAndFormatted = ({ decimals, value }: FormatValueParams) => ({
  raw: value,
  formatted: formatUnits(value, decimals),
})

/**
 * Render as a price format
 * @param {FormatValueParams}  - FormatValueParams
 */
export const renderAsPrice = ({ decimals, symbol = '$', value }: FormatValueParams) =>
  formatAmount(value, symbol, decimals, 'before')

export const renderAsAmount = ({ decimals, symbol = '', value }: FormatValueParams) =>
  formatAmount(value, symbol, decimals, 'after')

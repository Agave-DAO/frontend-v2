import { BigNumber, FixedNumber } from '@ethersproject/bignumber'

import { DAI_DECIMALS } from '../constants/common'

const DISPLAY_DECIMALS = 2

export const formatNumber = (value: number, displayDecimals = DISPLAY_DECIMALS): string =>
  value !== undefined
    ? Intl.NumberFormat('en', {
        maximumFractionDigits: displayDecimals,
      }).format(value)
    : ''

export const formatAmount = (
  value: BigNumber,
  decimals: number = DAI_DECIMALS,
  symbol = '$',
  symbolPosition: 'before' | 'after' = 'before',
): string =>
  `${symbolPosition === 'before' ? `${symbol} ` : ''}${formatNumber(
    FixedNumber.fromValue(value, decimals).toUnsafeFloat(),
  )}${symbolPosition === 'after' ? ` ${symbol} ` : ''}`

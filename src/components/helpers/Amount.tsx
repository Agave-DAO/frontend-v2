import { BigNumber } from 'ethers'

import { SymbolPosition, formatAmount } from '@/src/utils/common'

export const Amount = ({
  decimals,
  displayDecimals,
  symbol,
  symbolPosition,
  value,
}: {
  value: BigNumber
  decimals?: number
  symbol?: string
  symbolPosition?: SymbolPosition
  displayDecimals?: number
}) => <span>{formatAmount(value, decimals, symbol, symbolPosition, displayDecimals)}</span>

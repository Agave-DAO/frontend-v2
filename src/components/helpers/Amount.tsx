import { BigNumber } from 'ethers'

import { SymbolPosition, formatAmount } from '@/src/utils/common'

export const Amount = ({
  decimals,
  symbol,
  symbolPosition,
  value,
}: {
  value: BigNumber
  decimals?: number
  symbol?: string
  symbolPosition?: SymbolPosition
}) => <span>{formatAmount(value, decimals, symbol, symbolPosition)}</span>

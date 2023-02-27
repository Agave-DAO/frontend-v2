import { BigNumber } from 'ethers'

import { SymbolPosition, formatAmount } from '@/src/utils/common'

export const Amount = ({
  decimals,
  displayDecimals,
  symbol,
  symbolPosition,
  value,
}: {
  decimals?: number
  displayDecimals?: number
  symbol?: string
  symbolPosition?: SymbolPosition
  value: BigNumber
}) => <>{formatAmount(value, decimals, symbol, symbolPosition, displayDecimals)}</>

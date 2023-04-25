import { BigNumber } from '@ethersproject/bignumber'

import { SymbolPosition, formatAmount } from '@/src/utils/common'
import { NumberType } from '@/src/utils/format'

export const Amount = ({
  decimals,
  numberType,
  symbol,
  symbolPosition,
  value,
}: {
  decimals?: number
  symbol?: string
  symbolPosition?: SymbolPosition
  value: BigNumber
  numberType?: NumberType
}) => <>{formatAmount(value, decimals, symbol, symbolPosition, numberType)}</>

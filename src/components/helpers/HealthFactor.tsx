import { useMemo } from 'react'

import { BigNumber } from 'ethers'

import { MAX_HEALTH_FACTOR_VALUE_TO_RENDER } from '@/src/constants/common'
import { SymbolPosition, formatAmount, fromWei } from '@/src/utils/common'

export const HealthFactor = ({
  decimals = 18, //All health factors values are in wei format (18 decimals)
  displayDecimals = 1,
  symbol = '',
  symbolPosition,
  value,
}: {
  value: BigNumber
  decimals?: number
  symbol?: string
  symbolPosition?: SymbolPosition
  displayDecimals?: number
}) => {
  const renderAmount = useMemo(() => {
    const formatted = fromWei(value, decimals)
    if (formatted.gt(MAX_HEALTH_FACTOR_VALUE_TO_RENDER)) {
      return '∞'
    }
    return formatAmount(value, decimals, symbol, symbolPosition, displayDecimals)
  }, [value, decimals, symbol, symbolPosition, displayDecimals])

  return <span>{renderAmount}</span>
}

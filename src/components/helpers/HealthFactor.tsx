import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { SymbolPosition, formatHealthFactor } from '@/src/utils/common'

export const HealthFactor = ({
  decimals = 18, //All health factors values are in wei format (18 decimals)
  symbol = '',
  symbolPosition,
  value,
}: {
  value: BigNumber
  decimals?: number
  symbol?: string
  symbolPosition?: SymbolPosition
}) => {
  const renderAmount = useMemo(
    () => formatHealthFactor(value, decimals, symbol, symbolPosition),
    [value, decimals, symbol, symbolPosition],
  )

  return <>{renderAmount}</>
}

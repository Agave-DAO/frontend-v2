import { useMemo } from 'react'

import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useGetReserveLimits } from '@/src/hooks/queries/useGetReserveLimits'

export function useMaximumDeposit(marketAddress: string) {
  const { getMarketSize } = useMarketsData()

  const limits = useGetReserveLimits(marketAddress).data
  const marketSize = getMarketSize(marketAddress).wei

  const maximumDeposit = useMemo(() => {
    if (!marketSize || !limits) return ZERO_BN

    if (marketSize > limits.depositLimit.mul(1001).div(1000)) {
      return ZERO_BN
    } else {
      return limits.depositLimit.sub(marketSize).mul(9999).div(10000)
    }
  }, [marketSize, limits])
  return { maximumDeposit }
}

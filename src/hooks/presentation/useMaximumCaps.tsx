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

    if (marketSize.gt(limits.depositLimit.mul(10001).div(10000))) {
      return ZERO_BN
    } else {
      return limits.depositLimit.sub(marketSize).mul(99999).div(100000)
    }
  }, [marketSize, limits])
  return { maximumDeposit }
}

export function useMaximumBorrow(marketAddress: string) {
  const { getTotalBorrowed } = useMarketsData()
  const limits = useGetReserveLimits(marketAddress).data
  const totalBorrowed = getTotalBorrowed(marketAddress)

  const maximumBorrow = useMemo(() => {
    if (!totalBorrowed || !limits) return ZERO_BN

    if (totalBorrowed.gt(limits.borrowLimit.mul(10001).div(10000))) {
      return ZERO_BN
    } else {
      return limits.borrowLimit.sub(totalBorrowed).mul(99999).div(100000)
    }
  }, [totalBorrowed, limits])
  return { maximumBorrow }
}

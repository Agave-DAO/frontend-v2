import { Zero } from '@ethersproject/constants'

import { useRewardTokenData } from '@/src/hooks/symmetrics/useRewardTokenData'
import { getPriceShares } from '@/src/utils/markets'

export const useGetAgvePrice = () => {
  const rewardTokenData = useRewardTokenData()?.pools[0]

  return {
    agvePrice: rewardTokenData ? getPriceShares(rewardTokenData) : Zero,
  }
}

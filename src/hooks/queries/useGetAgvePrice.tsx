import { Zero } from '@ethersproject/constants'

import { useGetRewardTokenData } from '@/src/hooks/queries/useGetRewardTokenData'
import { getPriceShares } from '@/src/utils/markets'

export const useGetAgvePrice = () => {
  const rewardTokenData = useGetRewardTokenData()?.pools[0]

  return {
    agvePrice: rewardTokenData ? getPriceShares(rewardTokenData) : Zero,
  }
}

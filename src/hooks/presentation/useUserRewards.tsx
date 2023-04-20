import { AddressZero } from '@ethersproject/constants'

import { useGetStakingAgvePrice } from '../queries/useGetStakingAgvePrice'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useGetGnoPrice } from '@/src/hooks/queries/useGetGnoPrice'
import { useGetRewardsBalance } from '@/src/hooks/queries/useGetRewardsBalance'
import { calculateRewards } from '@/src/utils/calculateRewards'
import { formatAmount, fromWei } from '@/src/utils/common'

export const useUserRewards = (userAddress = AddressZero) => {
  const { rewardsBalance } = useGetRewardsBalance(userAddress)
  const { gnoPrice } = useGetGnoPrice()
  const agvePrice = useGetStakingAgvePrice()

  const { agveValue, gnoValue, totalValue } = calculateRewards({
    agvePrice: agvePrice || ZERO_BN,
    gnoPrice,
    rewardsBalance,
  })

  const unclaimedRewardsFormatted = formatAmount(rewardsBalance, undefined, '')
  const agveValueFormatted = formatAmount(fromWei(agveValue))
  const gnoValueFormatted = formatAmount(fromWei(gnoValue))
  const totalValueFormatted = formatAmount(fromWei(totalValue))

  return {
    agvePrice,
    agveValue,
    agveValueFormatted,
    gnoPrice,
    gnoValue,
    gnoValueFormatted,
    totalValue,
    totalValueFormatted,
    rewardsBalance,
    unclaimedRewardsFormatted,
  }
}

import { AddressZero } from '@ethersproject/constants'

import { useGetAgvePrice } from '@/src/hooks/agave/useGetAgvePrice'
import { useGetGnoPrice } from '@/src/hooks/agave/useGetGnoPrice'
import { useGetRewardsBalance } from '@/src/hooks/agave/useGetRewardsBalance'
import { calculateRewards } from '@/src/utils/calculateRewards'
import { formatAmount, fromWei } from '@/src/utils/common'

export const useCalculateUserRewards = (userAddress = AddressZero) => {
  const { rewardsBalance } = useGetRewardsBalance(userAddress)
  const { gnoPrice } = useGetGnoPrice()
  const { agvePrice } = useGetAgvePrice()

  const { agveValue, gnoValue, totalValue } = calculateRewards({
    agvePrice,
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

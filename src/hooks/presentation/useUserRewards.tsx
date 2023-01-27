import { AddressZero } from '@ethersproject/constants'

import { useGetAgvePrice } from '@/src/hooks/queries/useGetAgvePrice'
import { useGetGnoPrice } from '@/src/hooks/queries/useGetGnoPrice'
import { useGetRewardsBalance } from '@/src/hooks/queries/useGetRewardsBalance'
import { calculateRewards } from '@/src/utils/calculateRewards'
import { formatAmount, fromWei } from '@/src/utils/common'

export const useUserRewards = (userAddress = AddressZero) => {
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

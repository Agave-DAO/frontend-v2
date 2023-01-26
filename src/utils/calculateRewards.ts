import { BigNumber } from '@ethersproject/bignumber'

interface CalculateRewards {
  agvePrice: BigNumber
  gnoPrice: BigNumber
  rewardsBalance: BigNumber
}

/**
 * Calculates the rewards values for the "40% AGVE - 60% GNO" Token.
 * Returns the rewards values expressed in XDAI.
 * @param {BigNumber} agvePrice
 * @param {BigNumber} gnoPrice
 * @param {BigNumber} rewardsBalance
 * @returns {Object} { agveValue, gnoValue, totalValue }
 */
export const calculateRewards = ({ agvePrice, gnoPrice, rewardsBalance }: CalculateRewards) => {
  const agveRewards = rewardsBalance.mul(2).div(5) // 40%
  const gnoRewards = rewardsBalance.mul(3).div(5) // 60%
  const agveValue = agveRewards.mul(agvePrice)
  const gnoValue = gnoRewards.mul(gnoPrice)
  const totalValue = agveValue.add(gnoValue)

  return {
    agveValue,
    gnoValue,
    totalValue,
  }
}

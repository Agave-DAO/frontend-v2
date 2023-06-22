import { BigNumber } from '@ethersproject/bignumber'

interface CalculateRewards {
  agvePrice: BigNumber
  gnoPrice: BigNumber
  rewardsBalance: BigNumber
}

/**
 * Calculates the rewards values for the "50% AGVE - 50% GNO" Token.
 * Returns the rewards values expressed in XDAI.
 * @param {BigNumber} agvePrice
 * @param {BigNumber} gnoPrice
 * @param {BigNumber} rewardsBalance
 * @returns {Object} { agveValue, gnoValue, totalValue }
 */
export const calculateRewards = ({ agvePrice, gnoPrice, rewardsBalance }: CalculateRewards) => {
  const agveRewards = rewardsBalance.div(2) // 50%
  const gnoRewards = rewardsBalance.div(2) // 50%
  const agveValue = agveRewards.mul(agvePrice)
  const gnoValue = gnoRewards.mul(gnoPrice)
  const totalValue = agveValue.add(gnoValue)

  return {
    agveValue,
    gnoValue,
    totalValue,
  }
}

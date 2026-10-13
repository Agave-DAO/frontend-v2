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
  // Multiply before splitting so an odd reward unit retains its price precision.
  const agveValue = rewardsBalance.mul(agvePrice).div(2)
  const gnoValue = rewardsBalance.mul(gnoPrice).div(2)
  const totalValue = agveValue.add(gnoValue)

  return {
    agveValue,
    gnoValue,
    totalValue,
  }
}

import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { fromWei } from '@/src/utils/common'

/**
 * Calculates priceShare (liquidity / totalShares) and convert it to a BigNumber value.
 */
export const getPriceShares = (rewardData: { liquidity: string; totalShares: string }) => {
  const { liquidity, totalShares } = rewardData
  const [numerator, denominator] = [parseFloat(liquidity), parseFloat(totalShares)]

  if (denominator === 0) {
    return ZERO_BN
  }

  return BigNumber.from(((numerator / denominator) * 1e16).toFixed())
}

export const getIncentiveRate = ({
  emissionPerSeconds,
  priceShares,
  tokenAddress,
  tokenPrice,
  tokenSupply,
}: {
  tokenSupply: BigNumber
  emissionPerSeconds: BigNumber
  priceShares: BigNumber
  tokenPrice: BigNumber
  tokenAddress: string
}) => {
  // get tokenDecimals by tokenAddress
  const { decimals } = agaveTokens.getTokenByAddress(tokenAddress)

  const SECONDS_PER_YEAR = 31536000

  /* Converting the emission per second to emission per year. */
  const emissionPerYear = emissionPerSeconds.mul(SECONDS_PER_YEAR)

  /* Converting the token supply to DAI. */
  const totalSupplyInDaiWei = fromWei(tokenSupply.mul(tokenPrice), decimals)

  const APYPerYear = !totalSupplyInDaiWei.isZero()
    ? priceShares.mul(emissionPerYear).div(totalSupplyInDaiWei)
    : ZERO_BN

  // TODO mul the result to convert percentValue ??
  return APYPerYear.mul(10 ** 11)
}

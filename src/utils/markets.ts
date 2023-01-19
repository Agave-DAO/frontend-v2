import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'
import { fromWei } from '@/src/utils/common'

type Params = { totalSupply: BigNumber; price: BigNumber; tokenAddress: string }

/**
 * Calculates MarketSize of a token (totalSupply * tokenPrice / 10 ** tokenDecimals) and convert it to a BigNumber value.
 */
export const getMarketSize = ({ price, tokenAddress, totalSupply }: Params) => {
  const { decimals } = agaveTokens.getTokenByAddress(tokenAddress)

  return fromWei(totalSupply.mul(price), decimals)
}

/**
 * Calculates priceShare (liquidity / totalShares) and convert it to a BigNumber value.
 */
export const getPriceShares = (rewardData: { liquidity: string; totalShares: string }) => {
  const { liquidity, totalShares } = rewardData
  return BigNumber.from(((parseFloat(liquidity) / parseFloat(totalShares)) * 1e16).toFixed())
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

  const APYPerYear = priceShares.mul(emissionPerYear).div(totalSupplyInDaiWei)

  // TODO mul the result to convert percentValue ??
  return APYPerYear.mul(10 ** 11)
}

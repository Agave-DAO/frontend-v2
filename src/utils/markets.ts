import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { fromWei } from '@/src/utils/common'

export const getIncentiveRate = ({
  decimals,
  emissionPerSeconds,
  priceShares,
  tokenPrice,
  tokenSupply,
}: {
  tokenSupply: BigNumber
  emissionPerSeconds: BigNumber
  priceShares: BigNumber
  tokenPrice: BigNumber
  decimals: number
}) => {
  const SECONDS_PER_YEAR = 31536000

  /* Converting the emission per second to emission per year. */
  const emissionPerYear = emissionPerSeconds.mul(SECONDS_PER_YEAR)

  /* Converting the token supply to DAI. */
  const totalSupplyInDaiWei = fromWei(tokenSupply.mul(tokenPrice), decimals)

  const APYPerYear = !totalSupplyInDaiWei.isZero()
    ? priceShares.mul(emissionPerYear).div(totalSupplyInDaiWei)
    : ZERO_BN

  // TODO mul the result to convert percentValue with 25 decimals
  return APYPerYear.mul(10 ** 6)
}

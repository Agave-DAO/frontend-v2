import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '../config/agaveTokens'

type Params = { agTokenTotalSupply: BigNumber; price: BigNumber; tokenAddress: string }

export const getMarketSize = ({ agTokenTotalSupply, price, tokenAddress }: Params) => {
  const agToken = agaveTokens.getProtocolTokenInfo(tokenAddress, 'ag')
  return agTokenTotalSupply.mul(price).div(BigNumber.from(10).pow(agToken.decimals))
}

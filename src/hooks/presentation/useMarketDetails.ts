import { FixedNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { DISPLAY_DECIMALS } from '@/src/constants/common'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { fromWei } from '@/src/utils/common'

export const useMarketDetails = (tokenAddress: string) => {
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)
  const marketData = useMarketsData()
  const market = marketData.getMarket(tokenAddress)

  const liquidity = {
    wei: market.reserveData.availableLiquidity,
    get price() {
      return fromWei(this.wei.mul(market.priceData), tokenInfo.decimals)
    },
  }

  const borrowed = {
    wei: marketData.getTotalBorrowed(tokenAddress),
    get price() {
      return fromWei(this.wei.mul(market.priceData), tokenInfo.decimals)
    },
    get percentage() {
      return FixedNumber.fromValue(this.price.mul(100))
        .divUnsafe(FixedNumber.fromValue(liquidity.price.add(this.price)))
        .toUnsafeFloat()
    },
  }

  const reserveSize = {
    wei: marketData.getMarketSize(tokenAddress).wei,
    price: marketData.getMarketSize(tokenAddress).usd,
  }

  const utilizationRate = reserveSize.wei.gt(Zero)
    ? FixedNumber.from(borrowed.wei)
        .divUnsafe(FixedNumber.from(reserveSize.wei))
        .mulUnsafe(FixedNumber.from(100))
    : Zero

  return {
    borrowed,
    liquidity,
    market,
    reserveSize,
    utilizationRate: parseFloat(utilizationRate.toString()).toFixed(DISPLAY_DECIMALS),
  }
}

import { useMemo } from 'react'

import { OrderBookApi, OrderQuoteSide } from '@cowprotocol/cow-sdk'
import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { hexZeroPad } from 'ethers/lib/utils'
import useSWR from 'swr'

import { ADDRESS_ZERO } from '@/src/constants/common'
import { useCollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { formatAmount } from '@/src/utils/common'
import { NumberType } from '@/src/utils/format'

const orderBookApi = new OrderBookApi({
  env: 'prod',
})
function runBATest([originTokenAddress, destinationTokenAddress, abTest, appChainId]: [
  string | undefined,
  string | undefined,
  { quote: { buyAmount: string } } | undefined,
  number | undefined,
]) {
  if (
    originTokenAddress &&
    destinationTokenAddress &&
    abTest &&
    abTest.quote.buyAmount !== '0' &&
    appChainId
  ) {
    return orderBookApi.getQuote(
      {
        appData: hexZeroPad('0x0', 32),
        buyToken: originTokenAddress,
        from: ADDRESS_ZERO,
        kind: OrderQuoteSide.kind.SELL,
        partiallyFillable: false,
        receiver: ADDRESS_ZERO,
        sellAmountBeforeFee: abTest.quote.buyAmount,
        sellToken: destinationTokenAddress,
        validTo: Math.floor(Date.now() / 1000) + 60 * 30,
      },
      { chainId: appChainId },
    )
  }

  return { quote: { buyAmount: '0' } }
}

/**
 * Calculates the price impact of the swap using the ABA Test formula
 * `((finalValue - initialValue) / initialValue / 2) * 100`
 *
 * Where finalValue is the amount of the originToken tokens received after the swap,
 * and initialValue is the amount of destinationToken tokens received after swapping back to the original token
 *
 * To calculate finalValue and initialValue, we use cowSwap SDK, to get the quote
 * @returns {number} price impact
 */
export const usePriceImpact = () => {
  const { appChainId } = useWeb3ConnectedApp()
  const { state } = useCollateralSwapStore()

  const { data: abTest } = useSWR(
    [
      state.originToken?.extensions.protocolTokens?.wag,
      state.destinationToken?.extensions.protocolTokens?.wag,
      state.originAmount,
      appChainId,
      'abTest',
    ],
    runABTest,
    {
      suspense: true,
    },
  )

  const { data: baTest } = useSWR(
    [
      state.originToken?.extensions.protocolTokens?.wag,
      state.destinationToken?.extensions.protocolTokens?.wag,
      abTest,
      appChainId,
      'baTest',
    ],
    runBATest,
    {
      suspense: true,
    },
  )

  return useMemo(() => {
    let _priceImpact = 0

    if (
      abTest &&
      abTest.quote.sellAmount !== '0' &&
      baTest &&
      baTest.quote.buyAmount !== '0' &&
      state.originToken
    ) {
      const sellAmount = FixedNumber.from(
        formatAmount(
          BigNumber.from(abTest.quote.sellAmount),
          state.originToken.decimals,
          '',
          'after',
          NumberType.SwapTradeAmount,
        ),
      )

      const buyAmount = FixedNumber.from(
        formatAmount(
          BigNumber.from(baTest.quote.buyAmount),
          state.originToken.decimals,
          '',
          'after',
          NumberType.SwapTradeAmount,
        ),
      )

      _priceImpact = buyAmount
        .subUnsafe(sellAmount)
        .divUnsafe(sellAmount)
        .divUnsafe(FixedNumber.from(2))
        .mulUnsafe(FixedNumber.from(100))
        .toUnsafeFloat()
    }
    return _priceImpact
  }, [abTest, baTest, state.originToken])
}

function runABTest([originTokenAddress, destinationTokenAddress, originAmount, appChainId]: [
  string | undefined,
  string | undefined,
  string | undefined,
  number | undefined,
]) {
  if (
    originTokenAddress &&
    destinationTokenAddress &&
    originAmount &&
    originAmount !== '0' &&
    appChainId
  ) {
    return orderBookApi.getQuote(
      {
        appData: hexZeroPad('0x0', 32),
        buyToken: destinationTokenAddress,
        from: ADDRESS_ZERO,
        kind: OrderQuoteSide.kind.SELL,
        partiallyFillable: false,
        receiver: ADDRESS_ZERO,
        sellAmountBeforeFee: originAmount,
        sellToken: originTokenAddress,
        validTo: Math.floor(Date.now() / 1000) + 60 * 30,
      },
      { chainId: appChainId },
    )
  }

  return { quote: { buyAmount: '0', sellAmount: '0' } }
}

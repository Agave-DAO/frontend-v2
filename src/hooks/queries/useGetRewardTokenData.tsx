import { useMemo } from 'react'

import { BigNumber, FixedNumber } from '@ethersproject/bignumber'

import { useGetGnoPrice } from '@/src/hooks/queries/useGetGnoPrice'
import { useGetStakingAgvePrice } from '@/src/hooks/queries/useGetStakingAgvePrice'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { toWei } from '@/src/utils/common'

/**
 * This function retrieves data about a reward token and calculates the total liquidity size of a pool
 * based on the balance and price of each token in the pool.
 * @returns The `useGetRewardTokenData` function returns an object with two properties: `liquidity` and
 * `totalShares`. The `liquidity` property represents the total liquidity size of a pool, calculated by
 * iterating over the tokens in the pool and multiplying the balance of each token by its respective
 * price (AGVE or GNO). The `totalShares` property represents the total number of shares in the pool.
 */
export const useGetRewardTokenData = () => {
  const { appChainId } = useWeb3Connection()
  const gqlBalancer = getSubgraphSdkByNetwork(appChainId, SubgraphName.BalancerV2)

  const { data: rewardTokenData } = gqlBalancer.useBalancerV2Pool(undefined, {
    loadingTimeout: 5000,
    suspense: false,
    onSuccess: (data) => {
      if (data.pool) return data
      else return undefined
    },
  })
  const agvePrice = useGetStakingAgvePrice()
  const gnoPrice = useGetGnoPrice().gnoPrice
  const parsedData = useMemo(() => {
    const MockData = {
      liquidity: toWei('2300003081', 18),
      totalShares: toWei('4114', 18),
      priceShares: toWei((2300003081 / 4114).toString(), 18),
    }
    if (!rewardTokenData || !agvePrice || !gnoPrice) {
      return MockData
    }
    const { pool } = rewardTokenData

    if (!pool) return MockData

    const useExternalPrices = false

    let liquiditySize: number

    const totalSharesAsNumber = FixedNumber.from(pool.totalShares, 18).toUnsafeFloat()

    /* Calculating the total liquidity size of the Balancer pool by iterating over the
    tokens in the pool and multiplying the balance of each token by its respective price (AGVE or
    GNO).
     */
    if (!useExternalPrices) {
      liquiditySize = FixedNumber.from(pool.totalLiquidity, 28).toUnsafeFloat()
    } else {
      if (!pool?.tokens || !agvePrice || !gnoPrice) return
      const agvePriceAsNumber = FixedNumber.fromValue(agvePrice, 18).toUnsafeFloat()
      const gnoPriceAsNumber = FixedNumber.fromValue(gnoPrice, 18).toUnsafeFloat()
      liquiditySize = pool.tokens
        .map((token) => {
          if (token.symbol === 'AGVE') {
            return Number(token.balance) * agvePriceAsNumber
          }

          if (token.symbol === 'GNO') {
            return Number(token.balance) * gnoPriceAsNumber
          }
          return 0
        })
        .reduce((acc, curr) => acc + curr, 0)
    }

    const priceShares = totalSharesAsNumber > 0 ? liquiditySize / totalSharesAsNumber : 0
    return {
      liquidity: toWei(liquiditySize.toString(), 18),
      totalShares: toWei(pool?.totalShares.toString(), 18),
      priceShares: toWei(priceShares.toString(), 18),
    }
  }, [agvePrice, gnoPrice, rewardTokenData])

  return parsedData
}

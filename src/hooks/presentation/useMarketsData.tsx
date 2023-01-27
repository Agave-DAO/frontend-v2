import { useCallback } from 'react'

import { useGetMarketsData } from '../queries/useGetMarketsData'
import { AgaveProtocolTokenType, agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useGetRewardTokenData } from '@/src/hooks/queries/useGetRewardTokenData'
import {
  getIncentiveRate as calculateIncentiveRate,
  getMarketSize as calculateMarketSize,
  getPriceShares,
} from '@/src/utils/markets'

/**
 * Returns marketsData query result and a bunch of functions that are used to get data about the tokens
 * @param {string[]} string - string[]
 */

export const useMarketsData = (reserveTokensAddresses?: string[]) => {
  /* If reserveTokensAddresses is empty, then it will return the address of all the reserve tokens. */
  const marketAddresses = !reserveTokensAddresses?.length
    ? agaveTokens.reserveTokens.map(({ address }) => address)
    : reserveTokensAddresses

  const agaveMarketsData = useGetMarketsData(marketAddresses)
  const rewardTokenData = useGetRewardTokenData()?.pools[0]

  /* Get the market data for a given token address. */
  const getMarket = useCallback(
    (address: string) => {
      return agaveMarketsData?.find(({ tokenAddress }) => tokenAddress === address)
    },
    [agaveMarketsData],
  )

  /* Returns the market size of a token. */
  const getMarketSize = useCallback(
    (tokenAddress: string) => {
      const marketData = getMarket(tokenAddress)
      if (!marketData) {
        return ZERO_BN
      }
      const { availableLiquidity, totalVariableDebt } = marketData.reserveData

      return calculateMarketSize({
        tokenAddress,
        totalSupply: totalVariableDebt.add(availableLiquidity),
        price: marketData.priceData,
      })
    },
    [getMarket],
  )

  const getTotalBorrowed = useCallback(
    (tokenAddress: string) => {
      const marketData = getMarket(tokenAddress)
      if (!marketData) {
        return ZERO_BN
      }
      const { totalStableDebt, totalVariableDebt } = marketData.reserveData
      return totalStableDebt.add(totalVariableDebt)
    },
    [getMarket],
  )

  const getDepositAPY = useCallback(
    (tokenAddress: string) => {
      const marketData = getMarket(tokenAddress)
      if (!marketData) {
        return ZERO_BN
      }
      return marketData.reserveData.liquidityRate
    },
    [getMarket],
  )

  const getBorrowRate = useCallback(
    (tokenAddress: string) => {
      const marketData = getMarket(tokenAddress)
      if (!marketData) {
        return {
          stable: ZERO_BN,
          variable: ZERO_BN,
        }
      }
      const { stableBorrowRate, variableBorrowRate } = marketData.reserveData
      return {
        stable: stableBorrowRate,
        variable: variableBorrowRate,
      }
    },
    [getMarket],
  )

  const getIncentiveRate = useCallback(
    (tokenAddress: string, tokenType: AgaveProtocolTokenType) => {
      const marketData = getMarket(tokenAddress)
      if (!marketData || !marketData.incentiveData || !rewardTokenData) {
        return ZERO_BN
      }

      const {
        incentiveData,
        priceData: tokenPrice,
        reserveData: { availableLiquidity, totalVariableDebt },
      } = marketData

      const emissionPerSeconds =
        tokenType === 'ag'
          ? incentiveData.agTokenEmissionPerSeconds
          : tokenType === 'variableDebt'
          ? incentiveData.variableDebtEmissionPerSeconds
          : ZERO_BN

      const tokenSupply =
        tokenType === 'ag'
          ? totalVariableDebt.add(availableLiquidity)
          : tokenType === 'variableDebt'
          ? totalVariableDebt
          : ZERO_BN

      return calculateIncentiveRate({
        emissionPerSeconds,
        tokenSupply,
        priceShares: getPriceShares(rewardTokenData),
        tokenAddress,
        tokenPrice,
      })
    },
    [getMarket, rewardTokenData],
  )

  return {
    agaveMarketsData,
    getIncentiveRate,
    getMarketSize,
    getTotalBorrowed,
    getDepositAPY,
    getBorrowRate,
  }
}

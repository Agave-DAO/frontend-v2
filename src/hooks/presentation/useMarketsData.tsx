import { useCallback } from 'react'

import { AgaveProtocolTokenType, agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useGetMarketsData } from '@/src/hooks/queries/useGetMarketsData'
import { useGetRewardTokenData } from '@/src/hooks/queries/useGetRewardTokenData'
import { isSameAddress } from '@/src/utils/isSameAddress'
import {
  getIncentiveRate as calculateIncentiveRate,
  getMarketSize as calculateMarketSize,
  getPriceShares,
} from '@/src/utils/markets'

/**
 * Returns the AgaveMarketData for a given array of reserve tokens addresses.
 * @param {String} reserveTokensAddresses
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
      const marketFound = agaveMarketsData?.find(({ tokenAddress }) =>
        isSameAddress(address, tokenAddress),
      )
      if (!marketFound) {
        throw Error(`Market not found for token ${address}`)
      }

      return marketFound
    },
    [agaveMarketsData],
  )

  /* Returns the market size of a token. */
  const getMarketSize = useCallback(
    (tokenAddress: string) => {
      try {
        const marketData = getMarket(tokenAddress)
        const { availableLiquidity, totalVariableDebt } = marketData.reserveData

        return calculateMarketSize({
          tokenAddress,
          totalSupply: totalVariableDebt.add(availableLiquidity),
          price: marketData.priceData,
        })
      } catch (e) {
        console.error(e)
        return ZERO_BN
      }
    },
    [getMarket],
  )

  const getTotalBorrowed = useCallback(
    (tokenAddress: string) => {
      try {
        const marketData = getMarket(tokenAddress)
        const { totalStableDebt, totalVariableDebt } = marketData.reserveData

        return totalStableDebt.add(totalVariableDebt)
      } catch (e) {
        console.error(e)
        return ZERO_BN
      }
    },
    [getMarket],
  )

  const getDepositAPY = useCallback(
    (tokenAddress: string) => {
      try {
        const marketData = getMarket(tokenAddress)

        return marketData.reserveData.liquidityRate
      } catch (e) {
        console.error(e)
        return ZERO_BN
      }
    },
    [getMarket],
  )

  const getBorrowRate = useCallback(
    (tokenAddress: string) => {
      try {
        const marketData = getMarket(tokenAddress)
        const { stableBorrowRate, variableBorrowRate } = marketData.reserveData

        return {
          stable: stableBorrowRate,
          variable: variableBorrowRate,
        }
      } catch (e) {
        console.error(e)
        return {
          stable: ZERO_BN,
          variable: ZERO_BN,
        }
      }
    },
    [getMarket],
  )

  const getIncentiveRate = useCallback(
    (tokenAddress: string, tokenType: AgaveProtocolTokenType) => {
      if (!rewardTokenData) {
        return ZERO_BN
      }

      try {
        const marketData = getMarket(tokenAddress)
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
      } catch (e) {
        console.error(e)
        return ZERO_BN
      }
    },
    [getMarket, rewardTokenData],
  )

  return {
    agaveMarketsData,
    getIncentiveRate,
    getMarket,
    getMarketSize,
    getTotalBorrowed,
    getDepositAPY,
    getBorrowRate,
  }
}

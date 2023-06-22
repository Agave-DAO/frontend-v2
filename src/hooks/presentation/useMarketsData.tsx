import { useCallback } from 'react'

import { AgaveProtocolTokenType } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useGetMarketsData } from '@/src/hooks/queries/useGetMarketsData'
import { useGetRewardTokenData } from '@/src/hooks/queries/useGetRewardTokenData'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { fromWei } from '@/src/utils/common'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { getIncentiveRate as calculateIncentiveRate } from '@/src/utils/markets'

/**
 * Returns the AgaveMarketData for a given array of reserve tokens addresses.
 * @param {String} reserveTokensAddresses
 */
export const useMarketsData = () => {
  const agaveTokens = useAgaveTokens()

  const agaveMarketsData = useGetMarketsData()

  const rewardTokenData = useGetRewardTokenData()

  /* Get the market data for a given token address. */
  const getMarket = useCallback(
    (address: string) => {
      const tokenInfo = agaveTokens.getTokenByAddress(address)
      address = tokenInfo.extensions.isNative ? agaveTokens.wrapperToken.address : address

      const marketFound = agaveMarketsData?.find(({ tokenAddress }) =>
        isSameAddress(address, tokenAddress),
      )

      if (!marketFound) {
        throw Error(`Market not found for token ${address}`)
      }

      return marketFound
    },
    [agaveMarketsData, agaveTokens],
  )

  /* Returns the market size of a token. */
  const getMarketSize = useCallback(
    (tokenAddress: string) => {
      const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
      tokenAddress = tokenInfo.extensions.isNative ? agaveTokens.wrapperToken.address : tokenAddress

      try {
        const marketData = getMarket(tokenAddress)
        const { availableLiquidity, totalVariableDebt } = marketData.reserveData
        const { decimals } = agaveTokens.getTokenByAddress(tokenAddress)

        return {
          usd: fromWei(
            totalVariableDebt.add(availableLiquidity).mul(marketData.priceData),
            decimals,
          ),
          wei: totalVariableDebt.add(availableLiquidity),
        }
      } catch (e) {
        console.error(e)
        return { usd: ZERO_BN, wei: ZERO_BN }
      }
    },
    [agaveTokens, getMarket],
  )

  const getTotalBorrowed = useCallback(
    (tokenAddress: string) => {
      const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
      tokenAddress = tokenInfo.extensions.isNative ? agaveTokens.wrapperToken.address : tokenAddress

      try {
        const marketData = getMarket(tokenAddress)
        const { totalStableDebt, totalVariableDebt } = marketData.reserveData

        return totalStableDebt.add(totalVariableDebt)
      } catch (e) {
        console.error(e)
        return ZERO_BN
      }
    },
    [agaveTokens, getMarket],
  )

  const getDepositAPY = useCallback(
    (tokenAddress: string) => {
      const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
      tokenAddress = tokenInfo.extensions.isNative ? agaveTokens.wrapperToken.address : tokenAddress

      try {
        const marketData = getMarket(tokenAddress)

        return marketData.reserveData.liquidityRate
      } catch (e) {
        console.error(e)
        return ZERO_BN
      }
    },
    [agaveTokens, getMarket],
  )

  const getBorrowRate = useCallback(
    (tokenAddress: string) => {
      const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
      tokenAddress = tokenInfo.extensions.isNative ? agaveTokens.wrapperToken.address : tokenAddress

      try {
        const marketData = getMarket(tokenAddress)
        const stableBorrowRate =
          marketData.assetData.stableBorrowRateEnabled && marketData.assetData.borrowingEnabled
            ? marketData.reserveData.stableBorrowRate
            : ZERO_BN
        const variableBorrowRate = marketData.reserveData.variableBorrowRate

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
    [agaveTokens, getMarket],
  )

  const getIncentiveRate = useCallback(
    (tokenAddress: string, tokenType: AgaveProtocolTokenType) => {
      const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
      tokenAddress = tokenInfo.extensions.isNative ? agaveTokens.wrapperToken.address : tokenAddress

      if (!rewardTokenData?.priceShares) {
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
          priceShares: rewardTokenData.priceShares,
          decimals: tokenInfo.decimals,
          tokenPrice,
        })
      } catch (e) {
        console.error(e)
        return ZERO_BN
      }
    },
    [agaveTokens, getMarket, rewardTokenData],
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

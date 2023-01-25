import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'
import { useAgaveMarketsData } from '@/src/hooks/agave/useAgaveMarketsData'
import { useUserReservesData } from '@/src/hooks/agave/useUserReservesData'
import { fromWei } from '@/src/utils/common'

export type UserDeposit = {
  assetAddress: string
  depositedAmount: BigNumber
  depositedAmountInDAI: BigNumber
  depositRate: BigNumber
  asCollateral: boolean
}

/**
 * Combine the user's deposits with the market data.
 * @returns An array of UserDeposit objects
 * @example UserDeposit[] => [{assetAddress: '0x...', depositedAmount: BigNumber, depositRate: BigNumber, asCollateral: boolean}]
 */
export const useUserDeposits = (): UserDeposit[] => {
  const { data: userReservesData } = useUserReservesData()

  const { agaveMarketsData, getDepositAPY } = useAgaveMarketsData()

  if (!userReservesData || !agaveMarketsData) {
    return []
  }

  const userDepositsWithMarketData: (UserDeposit | null)[] = userReservesData.map(
    ({ reserveAddress, userReserveData }) => {
      /* Find the market data for the reserve that the user has a deposit. */
      const marketData = agaveMarketsData.find((market) => market.tokenAddress === reserveAddress)

      if (!marketData) {
        return null
      }

      if (userReserveData.currentATokenBalance.isZero()) {
        return null
      }

      const { decimals } = agaveTokens.getTokenByAddress(reserveAddress)

      return {
        assetAddress: reserveAddress,
        depositedAmount: userReserveData.currentATokenBalance,
        depositedAmountInDAI: fromWei(
          userReserveData.currentATokenBalance.mul(marketData.priceData),
          decimals,
        ),
        depositRate: getDepositAPY(reserveAddress),
        asCollateral: userReserveData.usageAsCollateralEnabled,
      }
    },
  )

  // Flatten the array to filter null values.
  // Reverse the array so that the most recent deposit is at the top.
  return userDepositsWithMarketData
    .flatMap((userBorrow) => (userBorrow ? [userBorrow] : []))
    .reverse()
}

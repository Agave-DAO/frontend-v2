import { BigNumber } from '@ethersproject/bignumber'

import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { fromWei } from '@/src/utils/common'
import { isSameAddress } from '@/src/utils/isSameAddress'

export type UserDeposit = {
  assetAddress: string
  depositedAmount: BigNumber
  depositedAmountInDAI: BigNumber
  depositRate: BigNumber
  incentiveRate: BigNumber
  asCollateral: boolean
}

/**
 * Combine the user's deposits with the market data.
 * @returns An array of UserDeposit objects
 * @example UserDeposit[] => [{assetAddress: '0x...', depositedAmount: BigNumber, depositRate: BigNumber, asCollateral: boolean}]
 */
export const useUserDeposits = (): UserDeposit[] => {
  const { data: userReservesData } = useGetUserReservesData()
  const agaveTokens = useAgaveTokens()

  const { agaveMarketsData, getDepositAPY, getIncentiveRate } = useMarketsData()

  if (!userReservesData || !agaveMarketsData) {
    return []
  }

  const userDepositsWithMarketData: (UserDeposit | null)[] = userReservesData.map(
    ({ reserveAddress, userReserveData }) => {
      /* Find the market data for the reserve that the user has a deposit. */
      const marketData = agaveMarketsData.find((market) =>
        isSameAddress(market.tokenAddress, reserveAddress),
      )

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
        incentiveRate: getIncentiveRate(reserveAddress, 'ag'),
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

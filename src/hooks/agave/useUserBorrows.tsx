import { BorrowMode, UserBorrow } from '../../pagePartials/dashboard/UserBorrows'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useAgaveMarketsData } from '@/src/hooks/agave/useAgaveMarketsData'
import { useUserReservesData } from '@/src/hooks/agave/useUserReservesData'
import { fromWei } from '@/src/utils/common'

/**
 * Combine the user's borrows with the market data.
 * Each reserve can have a stable and variable debt, so we need to return an array of UserBorrow objects for each reserve that
 * the user has a borrow. Then we flatten the result array into a single array of UserBorrow objects.
 * @returns An array of UserBorrow objects
 * @example UserBorrow[] => [{assetAddress: '0x...', borrowedAmount: BigNumber, borrowRate: {base: BigNumber, incentive: BigNumber, total: BigNumber}, borrowMode: 'Stable'}]
 *
 */
export const useUserBorrows = () => {
  const { data: userReservesData } = useUserReservesData()

  const { agaveMarketsData, getBorrowRate, getIncentiveRate } = useAgaveMarketsData()

  if (!userReservesData || !agaveMarketsData) {
    return []
  }

  const userBorrowsWithMarketData = userReservesData.map(({ reserveAddress, userReserveData }) => {
    /* Find the market data for the reserve that the user has a borrow. */
    const marketData = agaveMarketsData.find((market) => market.tokenAddress === reserveAddress)

    if (!marketData) {
      return null
    }

    /* Checking if the user has a variable or stable debt borrow for the current market. */
    const userHasVariableDebtBorrow = userReserveData.currentVariableDebt.gt(0)
    const userHasStableDebtBorrow = userReserveData.currentStableDebt.gt(0)

    const { decimals } = agaveTokens.getTokenByAddress(reserveAddress)

    const userReserveBorrows: UserBorrow[] = []

    if (userHasVariableDebtBorrow) {
      userReserveBorrows.push({
        assetAddress: reserveAddress,
        borrowMode: BorrowMode.Variable,
        borrowedAmount: userReserveData.currentVariableDebt,
        borrowedAmountInDAI: fromWei(
          userReserveData.currentVariableDebt.mul(marketData.priceData),
          decimals,
        ),
        borrowRate: {
          base: getBorrowRate(reserveAddress).variable,
          incentive: getIncentiveRate(reserveAddress, 'variableDebt'),
          total: getBorrowRate(reserveAddress).variable.sub(
            getIncentiveRate(reserveAddress, 'variableDebt'),
          ),
        },
      })
    }

    if (userHasStableDebtBorrow) {
      userReserveBorrows.push({
        assetAddress: reserveAddress,
        borrowMode: BorrowMode.Stable,
        borrowedAmount: userReserveData.currentStableDebt,
        borrowedAmountInDAI: fromWei(
          userReserveData.currentStableDebt.mul(marketData.priceData),
          decimals,
        ),
        borrowRate: {
          base: getBorrowRate(reserveAddress).stable,
          incentive: ZERO_BN,
          total: getBorrowRate(reserveAddress).stable,
        },
      })
    }

    return userReserveBorrows
  })

  // Flatten the array of arrays into a single array of UserBorrow objects and filtering out reserve Tokens that user hasn't borrowed.
  // Reverse the array so that the most recent borrow is at the top.
  return userBorrowsWithMarketData.flatMap((userBorrow) => userBorrow ?? []).reverse()
}

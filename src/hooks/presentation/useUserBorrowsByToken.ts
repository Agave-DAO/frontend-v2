import { ZERO_BN } from '@/src/constants/bigNumber'
import { useUserBorrows } from '@/src/hooks/presentation/useUserBorrows'
import { isSameAddress } from '@/src/utils/isSameAddress'

/**
 * @param {string} tokenAddress - The address of the token you want to get the borrows for.
 * @returns {object} - An object with the user's borrows for that token (variable|stable) and the totals borrowed in token and DAI.
 */
export function useUserBorrowsByToken(tokenAddress: string) {
  const userBorrows = useUserBorrows()
  const borrowsByToken = userBorrows.filter((borrow) =>
    isSameAddress(borrow.assetAddress, tokenAddress),
  )

  // get total borrowed amount in token and DAI
  const { totalBorrowed, totalBorrowedInDAI } = borrowsByToken.reduce(
    (acc, userBorrow) => {
      return {
        totalBorrowedInDAI: acc.totalBorrowedInDAI.add(userBorrow.borrowedAmountInDAI),
        totalBorrowed: acc.totalBorrowed.add(userBorrow.borrowedAmount),
      }
    },
    { totalBorrowedInDAI: ZERO_BN, totalBorrowed: ZERO_BN },
  )

  return { borrows: borrowsByToken, totalBorrowed, totalBorrowedInDAI }
}

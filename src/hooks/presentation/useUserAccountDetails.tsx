import { useMemo } from 'react'

import { ZERO_BN } from '@/src/constants/bigNumber'
import { useUserBorrows } from '@/src/hooks/presentation/useUserBorrows'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useGetRewardsBalance } from '@/src/hooks/queries/useGetRewardsBalance'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { toWei } from '@/src/utils/common'

export const useUserAccountDetails = (address: string) => {
  const userDeposits = useUserDeposits()
  const userBorrows = useUserBorrows()
  const [{ data }] = useGetUserAccountData(address)
  const { rewardsBalance } = useGetRewardsBalance(address)

  const { totalCollateralInDAI, totalDepositsInDAI } = useMemo(
    () =>
      userDeposits.reduce(
        ({ totalCollateralInDAI, totalDepositsInDAI }, { asCollateral, depositedAmountInDAI }) => ({
          totalDepositsInDAI: totalDepositsInDAI.add(depositedAmountInDAI),
          totalCollateralInDAI: asCollateral
            ? totalCollateralInDAI.add(depositedAmountInDAI)
            : totalCollateralInDAI,
        }),
        {
          totalCollateralInDAI: ZERO_BN,
          totalDepositsInDAI: ZERO_BN,
        },
      ),
    [userDeposits],
  )

  const totalBorrowsInDAI = useMemo(
    () =>
      userBorrows.reduce((acc, { borrowedAmountInDAI }) => acc.add(borrowedAmountInDAI), ZERO_BN),
    [userBorrows],
  )

  /* Calculating the current LTV of the user. */
  const currentLTV = useMemo(() => {
    if (totalCollateralInDAI.isZero()) return ZERO_BN
    return totalBorrowsInDAI.mul(toWei('100')).div(totalCollateralInDAI)
  }, [totalCollateralInDAI, totalBorrowsInDAI])

  return {
    userDeposits: totalDepositsInDAI,
    userBorrows: totalBorrowsInDAI,
    userRewards: rewardsBalance,
    userCollateral: totalCollateralInDAI,
    healthFactor: data?.[0].healthFactor || ZERO_BN,
    maxLtv: toWei(data?.[0].ltv || ZERO_BN, 16),
    currentLTV,
    currentLiquidationThreshold: toWei(data?.[0].currentLiquidationThreshold || ZERO_BN, 16),
  }
}

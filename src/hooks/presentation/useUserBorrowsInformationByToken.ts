import { BigNumber, FixedNumber } from '@ethersproject/bignumber'

import { InterestRateMode } from './useUserBorrows'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'

type MyInformationUserBorrows =
  | {
      variableDebtAmount: BigNumber
      stableDebtAmount: BigNumber
      healthFactor: string
      ltv: BigNumber
      maxBorrow: number
      userHasBorrows: true
      totalBorrowed: BigNumber
      totalBorrowedInDAI: BigNumber
    }
  | {
      variableDebtAmount?: unknown
      stableDebtAmount?: unknown
      totalBorrowed?: unknown
      totalBorrowedInDAI?: unknown
      healthFactor?: unknown
      ltv?: unknown
      maxBorrow?: unknown
      userHasBorrows: false
    }

export function useUserBorrowsInformationByToken({
  tokenAddress,
  userAddress,
}: {
  tokenAddress: string
  userAddress: string
}): MyInformationUserBorrows {
  const { borrows, totalBorrowed, totalBorrowedInDAI } = useUserBorrowsByToken(tokenAddress)
  const [{ data }] = useGetUserAccountData(userAddress)
  const marketData = useMarketsData([tokenAddress])
  const market = marketData.getMarket(tokenAddress)
  const userAccountData = data?.[0]

  if (!borrows.length || !userAccountData || !market) {
    return {
      userHasBorrows: false,
    }
  }

  const healthFactor = FixedNumber.fromValue(userAccountData.healthFactor, 18)
    .toUnsafeFloat()
    .toFixed(2)

  const ltv = userAccountData.ltv

  let maxBorrow: number
  try {
    maxBorrow =
      userAccountData.availableBorrowsETH.mul(1000).div(market.priceData).toNumber() / 1000
  } catch (e) {
    maxBorrow = 0
  }

  return {
    variableDebtAmount:
      borrows.find((b) => b.borrowMode === InterestRateMode.variable)?.borrowedAmount || ZERO_BN,
    stableDebtAmount:
      borrows.find((b) => b.borrowMode === InterestRateMode.stable)?.borrowedAmount || ZERO_BN,
    totalBorrowed,
    totalBorrowedInDAI,
    healthFactor,
    ltv,
    maxBorrow,
    userHasBorrows: true,
  }
}

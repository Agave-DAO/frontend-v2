import { BigNumber, FixedNumber } from '@ethersproject/bignumber'

import { useAgaveMarketsData } from '@/src/hooks/agave/useAgaveMarketsData'
import useGetUserAccountData from '@/src/hooks/agave/useGetUserAccountData'
import { useUserBorrowsByToken } from '@/src/hooks/agave/useUserBorrowsByToken'

type MyInformationUserBorrows =
  | {
      borrowedAmount: BigNumber
      healthFactor: string
      ltv: BigNumber
      maxBorrow: number
      userHasBorrows: true
    }
  | {
      borrowedAmount?: unknown
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
  const userBorrows = useUserBorrowsByToken(tokenAddress)
  const [{ data }] = useGetUserAccountData(userAddress)
  const marketData = useAgaveMarketsData([tokenAddress])
  const market = marketData.getMarket(tokenAddress)
  const userAccountData = data?.[0]

  if (!userBorrows || !userAccountData || !market) {
    return {
      userHasBorrows: false,
    }
  }

  const borrowedAmount = userBorrows.borrowedAmount

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
    borrowedAmount,
    healthFactor,
    ltv,
    maxBorrow,
    userHasBorrows: true,
  }
}

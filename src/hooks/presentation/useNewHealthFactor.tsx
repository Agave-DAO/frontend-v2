import { useCallback, useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenWithType } from '@/src/config/agaveTokens'
import { MAX_UINT_256, ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useUserBorrows } from '@/src/hooks/presentation/useUserBorrows'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { fromWei } from '@/src/utils/common'
import { isSameAddress } from '@/src/utils/isSameAddress'

type ActionType = 'deposit' | 'withdraw' | 'borrow' | 'repay'

export type UserAssetData = {
  tokenAddress: string
  totalUserBorrowedForAssetInDAI: BigNumber
  collateralBorrowCapacity: BigNumber
  collateralMaxCapacity: BigNumber
  borrowingEnabled: boolean
  liquidationThreshold: BigNumber
  assetPrice: BigNumber
}

/**
 * Populate the information about the user's assets, including the total
 * amount of DAI the user has borrowed for a given asset, the total amount of DAI the user can borrow
 * for a given asset, and the price of the asset, among other things.
 * @returns An object with the following properties:
 *   - userAssetsData: An array of UserAssetData objects.
 *   - totalCollateralMaxCapacity: A BigNumber representing the total amount of DAI the user can
 * borrow.
 *   - totalBorrowsValue: A BigNumber representing the total amount of DAI the user has borrowed.
 */
const useUserAllAssetsData = () => {
  const marketsData = useMarketsData().agaveMarketsData
  const userBorrows = useUserBorrows()
  const userDeposits = useUserDeposits()
  const agaveTokens = useAgaveTokens()

  const userAssetsData: UserAssetData[] | undefined = marketsData?.map((marketData) => {
    const ltv = marketData?.assetData.ltv
    const liquidationThreshold = marketData?.assetData.liquidationThreshold
    const tokenInfo = agaveTokens.getTokenByAddress(marketData.tokenAddress)

    /* Calculating the total amount of DAI the user has borrowed for a given asset. */
    const totalUserBorrowedForAssetInDAI = userBorrows
      .filter(({ assetAddress }) => isSameAddress(assetAddress, marketData.tokenAddress))
      .reduce((acc, next) => acc.add(next.borrowedAmountInDAI), ZERO_BN)

    let collateralBorrowCapacity = ZERO_BN
    let collateralMaxCapacity = ZERO_BN

    // calculate colalteral values if asset is enabled as collateral.
    if (marketData.assetData.usageAsCollateralEnabled) {
      /* Calculating the total amount of collateral the user has deposited for a given asset. */
      const totalUserCollateralForAssetInDAI = userDeposits
        .filter(({ assetAddress }) => isSameAddress(assetAddress, marketData.tokenAddress))
        .reduce((acc, next) => acc.add(next.depositedAmountInDAI), ZERO_BN)

      /* Calculating the total amount of DAI the user can borrow for a given asset. */
      collateralBorrowCapacity = ltv.mul(totalUserCollateralForAssetInDAI).div(10000)

      /* Calculating the total amount of DAI the user can borrow for a given asset. */
      collateralMaxCapacity = liquidationThreshold.mul(totalUserCollateralForAssetInDAI).div(10000)
    }
    return {
      borrowingEnabled: marketData.assetData.borrowingEnabled,
      liquidationThreshold: marketData.assetData.liquidationThreshold, // liquidation threshold is stored as a 4 decimal number
      tokenAddress: marketData.tokenAddress,
      totalUserBorrowedForAssetInDAI,
      collateralBorrowCapacity,
      collateralMaxCapacity,
      assetPrice: marketData.priceData,
      tokenSymbol: tokenInfo.symbol,
    }
  })

  const totalCollateralMaxCapacity = useMemo(
    () =>
      userAssetsData?.reduce((acc, next) => acc.add(next.collateralMaxCapacity), ZERO_BN) ||
      ZERO_BN,
    [userAssetsData],
  )

  // calculate total borrows value
  const totalBorrowsValue = useMemo(
    () =>
      userAssetsData?.reduce(
        (acc, next) => acc.add(next.totalUserBorrowedForAssetInDAI),
        ZERO_BN,
      ) || ZERO_BN,
    [userAssetsData],
  )

  return { userAssetsData, totalCollateralMaxCapacity, totalBorrowsValue }
}

/**
 * Given a user's asset data, the amount of a given asset they are
 * depositing/withdrawing/borrowing/repaying, and the current total borrows value and total collateral
 * max capacity, calculate the new health factor
 * @param  `amount` - the amount of the asset being deposited, withdrawn, borrowed, or repaid
 * @param  `tokenAddress` - the address of the market being deposited, withdrawn, borrowed, or repaid
 * @param  `totalBorrowsValue` - the total amount of DAI the user has borrowed
 * @param  `totalCollateralMaxCapacity` - the total amount of DAI the user can borrow
 * @param  `type` - the type of transaction being performed (borrow, repay, deposit, withdraw)
 * @param  `userAssetData` - the user's asset data
 * @returns The new health factor is being returned. To render the new health factor value in the UI you must divide by 10**3
 */
function newHealthFactorGivenAssetsData({
  amount,
  tokenInfo,
  totalBorrowsValue,
  totalCollateralMaxCapacity,
  type,
  userAssetData,
}: {
  amount: BigNumber
  tokenInfo: TokenWithType
  totalBorrowsValue: BigNumber
  totalCollateralMaxCapacity: BigNumber
  type: ActionType
  userAssetData: UserAssetData
}) {
  const collateral = type === 'deposit' || type === 'withdraw'
  const increase = type === 'deposit' || type === 'borrow'

  // Collateral Calculations
  const changeCollateralMaxCapacity = collateral
    ? fromWei(
        userAssetData.liquidationThreshold.mul(amount).mul(userAssetData.assetPrice),
        tokenInfo.decimals + 4, // sum 4 decimals of liquidation threshold
      )
    : ZERO_BN

  const newTotalCollateralMaxCapacity = increase
    ? totalCollateralMaxCapacity.add(changeCollateralMaxCapacity)
    : totalCollateralMaxCapacity.sub(changeCollateralMaxCapacity)

  // Borrow Calculations
  const changeTotalBorrowsValue = !collateral
    ? fromWei(amount.mul(userAssetData.assetPrice), tokenInfo.decimals)
    : ZERO_BN

  const newTotalBorrowsValue = increase
    ? totalBorrowsValue.add(changeTotalBorrowsValue)
    : totalBorrowsValue.gte(changeTotalBorrowsValue)
    ? totalBorrowsValue.sub(changeTotalBorrowsValue)
    : totalBorrowsValue.sub(userAssetData.totalUserBorrowedForAssetInDAI)

  // Multiply by 10^18 to convert to wei
  const newHealthFactor = !newTotalBorrowsValue.isZero()
    ? newTotalCollateralMaxCapacity.mul(BigNumber.from(10).pow(18)).div(newTotalBorrowsValue)
    : MAX_UINT_256

  return newHealthFactor
}

export function maxChangeGivenHealthFactor({
  amount,
  targetValue,
  tokenInfo,
  totalBorrowsValue,
  totalCollateralMaxCapacity,
  type,
  userAssetData,
}: {
  amount: BigNumber
  tokenInfo: TokenWithType
  type: 'repay' | 'deposit' | 'withdraw' | 'borrow'
  targetValue: BigNumber
  totalBorrowsValue: BigNumber
  totalCollateralMaxCapacity: BigNumber
  userAssetData: UserAssetData
}) {
  if (type === 'deposit' || type === 'repay') {
    return amount
  }

  if (amount.isZero()) return ZERO_BN

  const collateral = type === 'withdraw'

  if (!userAssetData?.borrowingEnabled) {
    if (type === 'borrow') return ZERO_BN
    if (type === 'withdraw') return amount
  }

  let maxAmountLimit = amount

  if (!collateral && userAssetData) {
    const newTBV = totalCollateralMaxCapacity.mul(1000).div(targetValue)

    const deltaTBV = newTBV.sub(totalBorrowsValue)

    maxAmountLimit = deltaTBV
      .mul(BigNumber.from(10).pow(tokenInfo.decimals))
      .div(userAssetData.assetPrice)
  } else if (collateral && userAssetData) {
    const newTCMC = totalBorrowsValue.mul(targetValue).div(1000)

    const deltaTCMC = totalCollateralMaxCapacity.sub(newTCMC)

    maxAmountLimit = userAssetData.liquidationThreshold.gt(ZERO_BN)
      ? deltaTCMC
          .mul(BigNumber.from(10).pow(tokenInfo.decimals + 4)) // sum 4 decimals of liquidation threshold
          .div(userAssetData.liquidationThreshold.mul(userAssetData.assetPrice))
      : amount

    maxAmountLimit = maxAmountLimit.lt(amount) ? maxAmountLimit : amount
  }

  return maxAmountLimit.gt(ZERO_BN) ? maxAmountLimit : ZERO_BN
}

export function useNewHealthFactorCalculator(marketAddress: string) {
  const agaveTokens = useAgaveTokens()

  marketAddress = agaveTokens.getTokenByAddress(marketAddress).extensions.isNative
    ? agaveTokens.wrapperToken.address
    : marketAddress

  const tokenInfo = agaveTokens.getTokenByAddress(marketAddress)

  const { totalBorrowsValue, totalCollateralMaxCapacity, userAssetsData } = useUserAllAssetsData()

  const userAssetData = useMemo(
    () => userAssetsData?.find(({ tokenAddress }) => isSameAddress(tokenAddress, marketAddress)),
    [marketAddress, userAssetsData],
  )

  const newHealthFactor = useCallback(
    ({ amount, type }: { amount: BigNumber; type: ActionType }): BigNumber => {
      if (!userAssetData) return ZERO_BN
      return newHealthFactorGivenAssetsData({
        amount,
        tokenInfo,
        totalBorrowsValue,
        totalCollateralMaxCapacity,
        type,
        userAssetData,
      })
    },
    [tokenInfo, totalBorrowsValue, totalCollateralMaxCapacity, userAssetData],
  )

  const maxAmountGivenHealthFactor = useCallback(
    ({
      amount,
      targetValue,
      type,
    }: {
      amount: BigNumber
      targetValue: BigNumber
      type: ActionType
    }) => {
      if (!userAssetData) return amount

      return maxChangeGivenHealthFactor({
        amount,
        tokenInfo,
        totalBorrowsValue,
        totalCollateralMaxCapacity,
        type,
        targetValue,
        userAssetData,
      })
    },
    [tokenInfo, totalBorrowsValue, totalCollateralMaxCapacity, userAssetData],
  )

  return { newHealthFactor, maxAmountGivenHealthFactor }
}

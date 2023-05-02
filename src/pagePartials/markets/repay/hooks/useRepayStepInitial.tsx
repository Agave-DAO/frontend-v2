import { useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MINIMUM_NATIVE_RESERVE } from '@/src/constants/common'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export function useRepayStepInitial({
  amount,
  interestRateMode,
  tokenAddress,
}: {
  amount: string
  interestRateMode: InterestRateMode
  tokenAddress: string
}) {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative

  const { address: accountAddress, balance: accountBalance } = useWeb3ConnectedApp()
  const { balance } = useAccountBalance({ accountAddress, tokenAddress })

  const borrowInfo = useUserBorrowsByToken(
    isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress,
  ).borrows.find(({ borrowMode }) => borrowMode === interestRateMode)

  // 0.05% extra to ensure sufficient coverage for interest accrued during the time between fetching and repaying
  const maxValueDebt = borrowInfo?.borrowedAmount.mul(10005).div(10000) || Zero
  const maxToRepay = useMemo(() => {
    const availableBalance =
      isNativeToken && accountBalance ? accountBalance.sub(MINIMUM_NATIVE_RESERVE) : balance
    return maxValueDebt.gt(availableBalance) ? availableBalance : maxValueDebt
  }, [isNativeToken, accountBalance, balance, maxValueDebt])

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  const marketsData = useMarketsData()
  const market = marketsData.getMarket(tokenAddress)
  const { stableBorrowRateEnabled = false } = market.assetData ?? {}

  return {
    disableSubmit,
    isStableBorrowRateEnabled: tokenInfo.extensions.isNative ? false : stableBorrowRateEnabled,
    maxToRepay,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  }
}

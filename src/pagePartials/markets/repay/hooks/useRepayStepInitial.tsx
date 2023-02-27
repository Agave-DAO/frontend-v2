import { useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { agaveTokens } from '@/src/config/agaveTokens'
import { usePageModeParam } from '@/src/hooks/presentation/usePageModeParam'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export function useRepayStepInitial({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) {
  const currentBorrowMode = usePageModeParam()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  const { address: accountAddress } = useWeb3ConnectedApp()
  const { balance: accountBalance } = useAccountBalance({ accountAddress, tokenAddress })

  const borrowInfo = useUserBorrowsByToken(tokenInfo.address).borrows.find(
    ({ borrowMode }) => borrowMode === currentBorrowMode,
  )

  // 0.05% extra to ensure sufficient coverage for interest accrued during the time between fetching and repaying
  const maxValueDebt = borrowInfo?.borrowedAmount.mul(10005).div(10000) || Zero
  const maxToRepay = useMemo(() => {
    return maxValueDebt.gt(accountBalance) ? accountBalance : maxValueDebt
  }, [maxValueDebt, accountBalance])

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  return {
    tokenInfo,
    maxToRepay,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInputStatus,
    tokenInputStatusText,
    disableSubmit,
  }
}

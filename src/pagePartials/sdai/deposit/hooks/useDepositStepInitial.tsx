import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MINIMUM_NATIVE_RESERVE } from '@/src/constants/common'
import { useGetTokenInfo } from '@/src/hooks/queries/useGetSavingsData'
import { useGetBalance } from '@/src/hooks/queries/useGetSavingsUserData'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export function useDepositStepInitial({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) {
  const { address: accountAddress, balance: accountBalance } = useWeb3ConnectedApp()
  const tokenInfo = useGetTokenInfo(tokenAddress)
  const isNativeToken = tokenInfo?.symbol == 'XDAI'
  const { balance } = useGetBalance(accountAddress, tokenAddress)

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  const finalDeposit = isNativeToken ? accountBalance.sub(MINIMUM_NATIVE_RESERVE) : balance

  useEffect(() => {
    if (BigNumber.from(amount).gt(finalDeposit)) {
      setTokenInputStatus(TextfieldStatus.error)
      setTokenInputStatusText('Input above user Balance')
    } else {
      setTokenInputStatus(undefined)
      setTokenInputStatusText(undefined)
    }
  }, [setTokenInputStatus, setTokenInputStatusText, amount, finalDeposit])

  return {
    tokenInfo,
    balance: finalDeposit,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInputStatus,
    tokenInputStatusText,
    disableSubmit,
  }
}

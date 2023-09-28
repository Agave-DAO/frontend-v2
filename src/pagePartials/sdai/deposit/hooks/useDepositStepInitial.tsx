import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MINIMUM_NATIVE_RESERVE } from '@/src/constants/common'
import { useMaximumDeposit } from '@/src/hooks/presentation/useMaximumCaps'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export function useDepositStepInitial({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative

  const { address: accountAddress, balance: accountBalance } = useWeb3ConnectedApp()
  const { balance } = useAccountBalance({ accountAddress, tokenAddress })

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const { maximumDeposit } = useMaximumDeposit(
    isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress,
  )

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  const maxAmount = isNativeToken ? accountBalance.sub(MINIMUM_NATIVE_RESERVE) : balance

  const finalDeposit = maxAmount.gt(maximumDeposit) ? maximumDeposit : maxAmount

  useEffect(() => {
    if (BigNumber.from(amount).gt(maximumDeposit.mul(100001).div(100000))) {
      setTokenInputStatus(TextfieldStatus.error)
      setTokenInputStatusText('Input exceeds Market deposit limit')
    } else if (BigNumber.from(amount).gt(maxAmount)) {
      setTokenInputStatus(TextfieldStatus.error)
      setTokenInputStatusText('Input above user Balance')
    } else {
      setTokenInputStatus(undefined)
      setTokenInputStatusText(undefined)
    }
  }, [setTokenInputStatus, setTokenInputStatusText, amount, maximumDeposit, maxAmount])

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

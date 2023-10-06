import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MINIMUM_NATIVE_RESERVE } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
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
  const isNativeToken = tokenInfo?.symbol === 'XDAI'

  const { address: accountAddress, balance: accountBalance } = useWeb3ConnectedApp()
  const { balance } = useAccountBalance({
    accountAddress,
    tokenAddress: isNativeToken ? contracts.WxDAI.address[100] : tokenAddress,
  })
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

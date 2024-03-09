import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MINIMUM_NATIVE_RESERVE } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { SavingsXDai__factory } from '@/types/generated/typechain'

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
  const sDAIContract = useContractInstance(SavingsXDai__factory, 'SavingsXDai', true)

  const { balance } = useAccountBalance({
    accountAddress,
    tokenAddress: isNativeToken ? contracts.WxDAI.address[100] : tokenAddress,
  })
  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()
  const [previewDeposit, setPreviewDeposit] = useState<BigNumber>(BigNumber.from(0))

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
  useEffect(() => {
    if (BigNumber.from(amount).gt(0)) {
      ;(async () => {
        setPreviewDeposit(await sDAIContract.previewDeposit(amount))
      })()
    }
  }, [amount, finalDeposit, sDAIContract])

  return {
    tokenInfo,
    balance: finalDeposit,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInputStatus,
    tokenInputStatusText,
    disableSubmit,
    previewDeposit,
  }
}

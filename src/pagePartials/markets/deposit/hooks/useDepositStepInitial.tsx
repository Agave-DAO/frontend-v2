import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MINIMUM_NATIVE_RESERVE, MIN_SAFE_HEALTH_FACTOR } from '@/src/constants/common'
import { useMaximumDeposit } from '@/src/hooks/presentation/useMaximumCaps'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { usePersistedState } from '@/src/hooks/usePersistedState'
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
  const [minSafeHF] = usePersistedState('minSafeHF', MIN_SAFE_HEALTH_FACTOR.toNumber())

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const { maxAmountGivenHealthFactor } = useNewHealthFactorCalculator(
    isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress,
  )

  const { maximumDeposit } = useMaximumDeposit(
    isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress,
  )

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  const maxSafeAmount = maxAmountGivenHealthFactor({
    amount: isNativeToken ? accountBalance.sub(MINIMUM_NATIVE_RESERVE) : balance,
    type: 'deposit',
    targetValue: BigNumber.from(minSafeHF),
  })

  const finalDeposit = maxSafeAmount.gt(maximumDeposit) ? maximumDeposit : maxSafeAmount

  useEffect(() => {
    if (BigNumber.from(amount).gt(maximumDeposit.mul(100001).div(100000))) {
      setTokenInputStatus(TextfieldStatus.error)
      setTokenInputStatusText('Input exceeds Market deposit limit')
    } else if (BigNumber.from(amount).gt(maxSafeAmount)) {
      setTokenInputStatus(TextfieldStatus.error)
      setTokenInputStatusText('Input above user Balance')
    } else {
      setTokenInputStatus(undefined)
      setTokenInputStatusText(undefined)
    }
  }, [setTokenInputStatus, setTokenInputStatusText, amount, maximumDeposit, maxSafeAmount])

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

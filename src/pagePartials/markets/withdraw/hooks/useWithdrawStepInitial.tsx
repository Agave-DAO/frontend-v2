import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MIN_SAFE_HEALTH_FACTOR } from '@/src/constants/common'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { usePersistedState } from '@/src/hooks/usePersistedState'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export function useWithdrawStepInitial({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative
  tokenAddress = isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress

  const [minSafeHF] = usePersistedState('minSafeHF', MIN_SAFE_HEALTH_FACTOR.toNumber())

  const { maxAmountGivenHealthFactor } = useNewHealthFactorCalculator(tokenAddress)
  const { address: accountAddress } = useWeb3ConnectedApp()
  const agTokenInfo = agaveTokens.getProtocolTokenInfo(tokenAddress, 'ag')
  const { balance: agTokenBalance } = useAccountBalance({
    accountAddress,
    tokenAddress: agTokenInfo.address,
  })

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  const maxSafeAmount = maxAmountGivenHealthFactor({
    amount: agTokenBalance,
    type: 'withdraw',
    targetValue: BigNumber.from(minSafeHF),
  })

  return {
    tokenInfo,
    maxToWithdraw: maxSafeAmount,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInputStatus,
    tokenInputStatusText,
    disableSubmit,
  }
}

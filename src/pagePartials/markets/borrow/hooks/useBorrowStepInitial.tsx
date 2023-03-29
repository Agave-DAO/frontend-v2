import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'
import { isNative } from 'lodash'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { agaveTokens } from '@/src/config/agaveTokens'
import { MIN_SAFE_HEALTH_FACTOR } from '@/src/constants/common'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useLocalStorage, usePersistedState } from '@/src/hooks/usePersistedState'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { toWei } from '@/src/utils/common'

export function useBorrowStepInitial({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) {
  const { address: accountAddress } = useWeb3ConnectedApp()
  const [minSafeHF] = usePersistedState('minSafeHF', MIN_SAFE_HEALTH_FACTOR.toNumber())

  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative
  const marketAddress = isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress

  const marketData = useMarketsData([marketAddress])
  const market = marketData.getMarket(marketAddress)
  const { availableLiquidity } = market.reserveData ?? {}

  const [{ data: userAccountData }] = useGetUserAccountData(accountAddress)
  const availableToBorrowDAI = userAccountData?.[0].availableBorrowsETH

  const [{ data: assetPricesInDAI }] = useGetAssetsPriceInDAI([marketAddress])
  const tokenPrice = assetPricesInDAI?.[0]?.[0] ?? Zero

  const userMaxAvailable = tokenPrice.gt(Zero)
    ? toWei(availableToBorrowDAI ?? Zero, tokenInfo.decimals).div(tokenPrice)
    : Zero

  const maxToBorrow =
    availableLiquidity && userMaxAvailable?.gt(availableLiquidity)
      ? availableLiquidity
      : userMaxAvailable

  const { maxAmountGivenHealthFactor } = useNewHealthFactorCalculator(marketAddress)

  const maxSafeAmountToBorrow = maxAmountGivenHealthFactor({
    amount: maxToBorrow,
    type: 'borrow',
    targetValue: BigNumber.from(minSafeHF),
  })

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  return {
    tokenInfo,
    maxToBorrow: maxSafeAmountToBorrow,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInputStatus,
    tokenInputStatusText,
    disableSubmit,
  }
}

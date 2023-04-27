import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { MIN_SAFE_HEALTH_FACTOR } from '@/src/constants/common'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { usePersistedState } from '@/src/hooks/usePersistedState'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
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
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative
  const marketAddress = isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress

  const marketData = useMarketsData()
  const market = marketData.getMarket(tokenAddress)
  const { availableLiquidity } = market.reserveData ?? {}
  const { stableBorrowRateEnabled = false } = market.assetData ?? {}

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

  const borrowStableAPR = marketData.getBorrowRate(tokenAddress).stable
  const borrowVariableAPR = marketData
    .getBorrowRate(tokenAddress)
    .variable.sub(marketData.getIncentiveRate(tokenAddress, 'variableDebt'))

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || !amount || BigNumber.from(amount).eq(Zero)

  return {
    borrowStableAPR,
    borrowVariableAPR,
    disableSubmit,
    isStableBorrowRateEnabled: tokenInfo.extensions.isNative ? false : stableBorrowRateEnabled,
    maxToBorrow: maxSafeAmountToBorrow,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  }
}

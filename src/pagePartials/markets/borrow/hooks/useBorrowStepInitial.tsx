import { useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { agaveTokens } from '@/src/config/agaveTokens'
import { MIN_SAFE_HEALTH_FACTOR } from '@/src/constants/common'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { toWei } from '@/src/utils/common'

export function useBorrowStepInitial({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const { address: accountAddress } = useWeb3ConnectedApp()

  const marketData = useMarketsData([tokenAddress])
  const market = marketData.getMarket(tokenAddress)
  const { availableLiquidity } = market.reserveData ?? {}

  const [{ data: userAccountData }] = useGetUserAccountData(accountAddress)
  const availableToBorrowDAI = userAccountData?.[0].availableBorrowsETH

  const [{ data: assetPricesInDAI }] = useGetAssetsPriceInDAI([tokenInfo.address])
  const tokenPrice = assetPricesInDAI?.[0]?.[0] ?? Zero

  const userMaxAvailable = tokenPrice.gt(Zero)
    ? toWei(availableToBorrowDAI ?? Zero, tokenInfo.decimals).div(tokenPrice)
    : Zero

  const maxToBorrow =
    availableLiquidity && userMaxAvailable?.gt(availableLiquidity)
      ? availableLiquidity
      : userMaxAvailable

  const { maxAmountGivenHealthFactor } = useNewHealthFactorCalculator(tokenInfo.address)

  const maxSafeAmountToBorrow = maxAmountGivenHealthFactor({
    amount: maxToBorrow,
    type: 'borrow',
    targetValue: MIN_SAFE_HEALTH_FACTOR,
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
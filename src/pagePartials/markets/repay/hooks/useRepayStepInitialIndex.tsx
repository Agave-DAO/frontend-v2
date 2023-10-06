import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

// TODO: This is a duplicate of useDepositStepInitialIndex.tsx. Refactor to a single hook.
export const useRepayStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { appChainId } = useWeb3ConnectedApp()
  const agaveLendingAddress = contracts['AgaveLendingPool'].address[appChainId]
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative
  const asset = isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress

  const { approvedAmount: allowance } = useGetERC20Allowance(asset, agaveLendingAddress)

  return useMemo(() => {
    if (isNativeToken) {
      return 1
    }

    const isAllowanceEnough = !allowance.isZero() && allowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [isNativeToken, allowance, amount])
}

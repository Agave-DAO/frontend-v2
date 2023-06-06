import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { WETHGateway__factory } from '@/types/generated/typechain'

export const useWithdrawStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative

  const wrappedNativeGatewayAddress = useContractInstance(
    WETHGateway__factory,
    'WETHGateway',
  ).address

  const agTokenInfo = agaveTokens.getProtocolTokenInfo(
    isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress,
    'ag',
  )

  const { approvedAmount: wrappedNativeGatewayAllowance } = useGetERC20Allowance(
    agTokenInfo.address,
    wrappedNativeGatewayAddress,
  )

  return useMemo(() => {
    const isAllowanceEnough = isNativeToken
      ? !wrappedNativeGatewayAllowance.isZero() &&
        wrappedNativeGatewayAllowance.gte(BigNumber.from(amount))
      : false

    return isAllowanceEnough ? 1 : 0
  }, [amount, isNativeToken, wrappedNativeGatewayAllowance])
}

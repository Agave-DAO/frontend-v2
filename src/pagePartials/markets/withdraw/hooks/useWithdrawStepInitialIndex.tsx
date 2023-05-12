import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { AgaveLending__factory, WETHGateway__factory } from '@/types/generated/typechain'

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

  const agaveLendingAddress = useContractInstance(AgaveLending__factory, 'AgaveLendingPool').address

  const { approvedAmount: agaveLendingAllowance } = useGetERC20Allowance(
    tokenAddress,
    agaveLendingAddress,
  )

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
    const allowance = isNativeToken ? wrappedNativeGatewayAllowance : agaveLendingAllowance

    const isAllowanceEnough = !allowance.isZero() && allowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [agaveLendingAllowance, amount, isNativeToken, wrappedNativeGatewayAllowance])
}

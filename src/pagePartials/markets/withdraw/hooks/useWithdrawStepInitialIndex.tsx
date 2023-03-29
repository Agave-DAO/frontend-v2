import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'
import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export const useWithdrawStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const isNativeToken = tokenInfo.extensions.isNative

  const { appChainId } = useWeb3ConnectedApp()
  const agaveLendingAddress = contracts['AgaveLendingPool'].address[appChainId]
  const { approvedAmount: agaveLendingAllowance } = useGetERC20Allowance(
    tokenAddress,
    agaveLendingAddress,
  )

  const wrappedNativeGatewayAddress = contracts['WETHGateway'].address[appChainId]
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

import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { contracts } from '@/src/contracts/contracts'
import { useGetVariableDebtBorrowAllowance } from '@/src/hooks/queries/useGetVariableDebtBorrowAllowance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export const useBorrowStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { appChainId } = useWeb3ConnectedApp()
  const agaveTokens = useAgaveTokens()
  const wrappedNativeGatewayAddress = contracts['WETHGateway'].address[appChainId]
  const variableDebtTokenAddress = agaveTokens.getProtocolTokenInfo(
    agaveTokens.wrapperToken.address,
    'variableDebt',
  ).address
  const { approvedAmount: borrowAllowance } = useGetVariableDebtBorrowAllowance(
    variableDebtTokenAddress,
    wrappedNativeGatewayAddress,
  )

  return useMemo(() => {
    const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

    if (!tokenInfo.extensions.isNative) {
      return 1
    }

    const isAllowanceEnough =
      !borrowAllowance.isZero() && borrowAllowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [agaveTokens, tokenAddress, borrowAllowance, amount])
}

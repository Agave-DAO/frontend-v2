import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { useGetVariableDebtBorrowAllowance } from '@/src/hooks/queries/useGetVariableDebtBorrowAllowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { WETHGateway__factory } from '@/types/generated/typechain'

export const useBorrowStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const agaveTokens = useAgaveTokens()
  const wrappedNativeGatewayAddress = useContractInstance(
    WETHGateway__factory,
    'WETHGateway',
  ).address
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

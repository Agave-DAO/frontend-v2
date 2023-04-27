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

  const { approvedAmount: allowance } = useGetERC20Allowance(tokenAddress, agaveLendingAddress)

  return useMemo(() => {
    const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

    if (tokenInfo.extensions.isNative) {
      return 1
    }

    const isAllowanceEnough = !allowance.isZero() && allowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [agaveTokens, allowance, amount, tokenAddress])
}

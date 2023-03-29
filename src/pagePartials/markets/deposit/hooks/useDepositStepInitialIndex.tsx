import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'
import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export const useDepositStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { appChainId } = useWeb3ConnectedApp()
  const agaveLendingAddress = contracts['AgaveLendingPool'].address[appChainId]

  const { approvedAmount: allowance } = useGetERC20Allowance(tokenAddress, agaveLendingAddress)

  return useMemo(() => {
    const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

    if (tokenInfo.extensions.isNative) {
      return 1
    }

    const isAllowanceEnough = !allowance.isZero() && allowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [allowance, amount, tokenAddress])
}

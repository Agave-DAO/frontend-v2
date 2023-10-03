import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useGetTokenInfo } from '@/src/hooks/queries/useGetSavingsData'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export const useDepositStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { appChainId } = useWeb3ConnectedApp()
  const SavingsXDaiAdapterAddress = contracts['SavingsXDaiAdapter'].address[appChainId]

  const { approvedAmount: allowance } = useGetERC20Allowance(
    tokenAddress,
    SavingsXDaiAdapterAddress,
  )

  const tokenInfo = useGetTokenInfo(tokenAddress)

  return useMemo(() => {
    if (tokenInfo.isNative) {
      return 1
    }

    const isAllowanceEnough = !allowance.isZero() && allowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [allowance, amount, tokenInfo])
}

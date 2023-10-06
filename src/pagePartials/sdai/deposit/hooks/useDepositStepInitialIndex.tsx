import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
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
  const wxdai = contracts.WxDAI.address[appChainId]
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  const { approvedAmount: allowance } = useGetERC20Allowance(wxdai, SavingsXDaiAdapterAddress)
  return useMemo(() => {
    if (tokenInfo.symbol === 'XDAI') {
      return 0
    }

    const isAllowanceEnough = !allowance.isZero() && allowance.gte(BigNumber.from(amount))

    return isAllowanceEnough ? 1 : 0
  }, [allowance, amount, tokenInfo])
}

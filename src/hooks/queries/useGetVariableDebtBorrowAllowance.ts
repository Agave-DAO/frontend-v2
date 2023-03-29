import { ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { VariableDebtToken__factory } from '@/types/generated/typechain'

/**
 * It returns the amount of tokens that the user has approved the spender to borrow on their behalf
 * @param {string} tokenAddress - The address of the VariableDebt token you want to check the borrow allowance for.
 * @param {string} spenderAddress - The address of the contract that will be allowed to spend the
 * token.
 */
export const useGetVariableDebtBorrowAllowance = (tokenAddress: string, spenderAddress: string) => {
  const { address } = useWeb3ConnectedApp()

  const variableDebtToken = useContractInstance(VariableDebtToken__factory, tokenAddress)
  const calls = [variableDebtToken.borrowAllowance] as const

  const [{ data }, refetch] = useContractCall(
    calls,
    [[address, spenderAddress]],
    `allowance-${tokenAddress}-${address}-${spenderAddress}`,
    {
      fallbackData: [ZERO_BN],
    },
  )

  return {
    approvedAmount: data?.[0] ?? ZERO_BN,
    refetchAllowance: refetch,
  }
}

import { ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { ERC20__factory } from '@/types/generated/typechain'
/**
 * It returns the amount of tokens that the user has approved the spender to spend on their behalf
 * @param {string} tokenAddress - The address of the ERC20 token you want to check the allowance for.
 * @param {string} spenderAddress - The address of the contract that will be allowed to spend the
 * token.
 */
export const useGetERC20Allowance = (tokenAddress: string, spenderAddress: string) => {
  const { address } = useWeb3ConnectedApp()

  const erc20 = useContractInstance(ERC20__factory, tokenAddress)
  const calls = [erc20.allowance] as const

  const [{ data, error }, refetch] = useContractCall(
    calls,
    [[address, spenderAddress]],
    `allowance-${tokenAddress}-${address}-${spenderAddress}`,
  )
  return {
    approvedAmount: data ? data[0] : ZERO_BN,
    error: error,
    refetchAllowance: refetch,
  }
}

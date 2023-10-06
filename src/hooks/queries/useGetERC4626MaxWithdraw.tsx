import { ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { SavingsXDai__factory } from '@/types/generated/typechain'

/**
 * It returns the amount of tokens that the user has approved the spender to spend on their behalf
 * @param {string} tokenAddress - The address of the ERC20 token you want to check the allowance for.
 * @param {string} spenderAddress - The address of the contract that will be allowed to spend the
 * token.
 */
export const useGetERC4626MaxWithdraw = (vaultAddress: string) => {
  const sdai = useContractInstance(SavingsXDai__factory, 'SavingsXDai', true)
  const { address } = useWeb3ConnectedApp()

  const calls = [sdai.maxWithdraw] as const

  const [{ data }, refetch] = useContractCall(
    calls,
    [[address]],
    `maxWithdraw-${address}-${vaultAddress}`,
  )
  return {
    maxWithdrawAmount: data?.[0] ?? ZERO_BN,
    refetchMaxWithdraw: refetch,
  }
}

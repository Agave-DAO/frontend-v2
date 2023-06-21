import { BigNumber } from '@ethersproject/bignumber'
import useSWR from 'swr'

import { useMarketsData } from '../presentation/useMarketsData'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { fromWei } from '@/src/utils/common'
import { ERC20__factory } from '@/types/generated/typechain'

interface VaultBalance {
  balanceInDai: BigNumber
  balanceRaw: BigNumber
  token: TokenWithType
  agToken: TokenWithType
}
/**
 * Gets the balance of a user's vault for each agToken of the reserve token.
 * @param {string} vaultAddress - The address of the user's vault.
 * @returns An object containing the vault balance and a function to refetch the balance.
 */
export const useGetUserVaultBalances = (vaultAddress: string) => {
  const { batchProvider } = useWeb3ConnectedApp()
  const { agaveMarketsData } = useMarketsData()

  // Get current market reserve tokens
  const agaveReserveTokens = useAgaveTokens()

  // Gets the balance of the user's vault for each reserve token that has an related agToken.
  const { data: vaultBalances, mutate: refetchUserVaultBalance } = useSWR(
    vaultAddress && agaveMarketsData?.length
      ? { key: `vaultBalance-${vaultAddress}`, vaultAddress: vaultAddress }
      : null,
    async ({ vaultAddress }) => {
      if (!agaveMarketsData) {
        return
      }
      const results = await Promise.all(
        agaveMarketsData.map(async (reserveToken) => {
          const marketToken = agaveReserveTokens.getTokenByAddress(reserveToken.tokenAddress)

          // get related tokens for the reserve token
          const relatedTokens = agaveReserveTokens.getRelatedTokensByAddress(
            reserveToken.tokenAddress,
          )
          const agToken = relatedTokens.find((item) => item.type === 'ag')

          if (!agToken) {
            return
          }

          const contract = ERC20__factory.connect(agToken.address, batchProvider)
          const balance = await contract.balanceOf(vaultAddress)

          if (balance.isZero()) {
            return
          }

          return {
            balanceRaw: balance,
            token: marketToken,
            balanceInDai: fromWei(balance.mul(reserveToken.priceData), marketToken.decimals),
            agToken,
          } as VaultBalance
        }),
      )

      // Filter out undefined results
      const filteredResults = results.filter(
        (result): result is VaultBalance => result !== undefined,
      )

      return filteredResults
    },
  )

  return {
    vaultBalance: vaultBalances,
    refetchUserVaultBalance,
  }
}

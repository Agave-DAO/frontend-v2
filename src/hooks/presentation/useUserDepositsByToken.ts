import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { isSameAddress } from '@/src/utils/isSameAddress'

export function useUserDepositsByToken(tokenAddress: string) {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  tokenAddress = tokenInfo.extensions.isNative ? agaveTokens.wrapperToken.address : tokenAddress

  const userDeposits = useUserDeposits()
  const depositsByToken = userDeposits.filter((deposit) =>
    isSameAddress(deposit.assetAddress, tokenAddress),
  )

  // there's only one deposit per token
  return depositsByToken.length ? depositsByToken[0] : null
}

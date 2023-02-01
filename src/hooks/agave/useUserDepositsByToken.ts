import { useUserDeposits } from '@/src/hooks/agave/useUserDeposits'
import { isSameAddress } from '@/src/utils/isSameAddress'

export function useUserDepositsByToken(tokenAddress: string) {
  const userDeposits = useUserDeposits()
  const depositsByToken = userDeposits.filter((deposit) =>
    isSameAddress(deposit.assetAddress, tokenAddress),
  )

  // there's only one deposit per token
  return depositsByToken.length ? depositsByToken[0] : null
}

import { useUserBorrows } from '@/src/hooks/agave/useUserBorrows'
import { isSameAddress } from '@/src/utils/isSameAddress'

export function useUserBorrowsByToken(tokenAddress: string) {
  const userBorrows = useUserBorrows()
  const borrowsByToken = userBorrows.filter((borrow) =>
    isSameAddress(borrow.assetAddress, tokenAddress),
  )

  // there's only one borrow per token
  return borrowsByToken.length ? borrowsByToken[0] : null
}

import { BigNumber } from '@ethersproject/bignumber'

import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useUserDepositsByToken } from '@/src/hooks/presentation/useUserDepositsByToken'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'

type MyInformationUserDeposits =
  | {
      balance: BigNumber
      depositedAmount: BigNumber
      userHasDeposits: true
    }
  | {
      balance?: unknown
      depositedAmount?: unknown
      userHasDeposits: false
    }

export function useUserDepositsInformationByToken({
  tokenAddress,
  userAddress,
}: {
  tokenAddress: string
  userAddress: string
}): MyInformationUserDeposits {
  const userDeposits = useUserDepositsByToken(tokenAddress)
  const { balance } = useAccountBalance({ accountAddress: userAddress, tokenAddress })
  const marketData = useMarketsData()
  const market = marketData.getMarket(tokenAddress)

  if (!userDeposits || !market) {
    return { userHasDeposits: false }
  }

  return {
    depositedAmount: userDeposits.depositedAmount,
    balance,
    userHasDeposits: true,
  }
}

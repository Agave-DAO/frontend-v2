import { ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AgaveLending__factory } from '@/types/generated/typechain'
import { DataTypes } from '@/types/generated/typechain/AgaveLending'

export type ReserveLimits = Pick<
  DataTypes.ReserveLimitsStructOutput,
  'depositLimit' | 'borrowLimit' | 'collateralUsageLimit'
>
export const useGetReserveLimits = (tokenAddress: string) => {
  let data: ReserveLimits = {
    depositLimit: ZERO_BN,
    borrowLimit: ZERO_BN,
    collateralUsageLimit: ZERO_BN,
  }

  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const calls = [lendingPool.getReserveLimits] as const
  const [{ data: reserveLimits }, refetch] = useContractCall(
    calls,
    [[tokenAddress]],
    `getReserveLimits-${tokenAddress}`,
  )
  const limits = reserveLimits?.[0]

  if (limits) {
    data = {
      depositLimit: limits.depositLimit,
      borrowLimit: limits.borrowLimit,
      collateralUsageLimit: limits.collateralUsageLimit,
    }
  }

  return { data, refetch }
}

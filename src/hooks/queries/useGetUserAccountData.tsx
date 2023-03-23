import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AgaveLending__factory } from '@/types/generated/typechain'
/**
 * 
 * 
 * @returns {
    totalCollateralETH: BigNumber; // as wei
    totalDebtETH: BigNumber; // as wei
    availableBorrowsETH: BigNumber; // as wei
    currentLiquidationThreshold: BigNumber; // as Fixed4 -> e.g. 7021 = 70.21
    ltv: BigNumber; // as Fixed4 -> e.g. 7021 = 70.21
    healthFactor: BigNumber; // as Wei
 * }
 */
export default function useGetUserAccountData(address: string) {
  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')

  const calls = [lendingPool.getUserAccountData] as const
  return useContractCall(calls, [[address as string]], `lendingPool-getUserAccountData-${address}`)
}

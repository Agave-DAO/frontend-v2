import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AgaveLending__factory } from '@/types/generated/typechain'

export default function useGetUserAccountData(address: string) {
  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')

  const calls = [lendingPool.getUserAccountData] as const
  return useContractCall(
    calls,
    [[address as string]],
    `lendingPool-getUserAccountData-${address}`,
    { refreshInterval: 10_000 },
  )
}

import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AgaveLendingABI__factory } from '@/types/generated/typechain'

export default function useGetUserAccountData(address: string) {
  const lendingPool = useContractInstance(AgaveLendingABI__factory, 'LendingPool')

  const calls = [lendingPool.getUserAccountData] as const
  return useContractCall(
    calls,
    [[address as string]],
    `lendingPool-getUserAccountData-${address}`,
    { refreshInterval: 10_000 },
  )
}

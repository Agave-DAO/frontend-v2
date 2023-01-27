import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AaveOracle__factory } from '@/types/generated/typechain'

export default function useGetAssetsPriceInDAI(addresses: string[]) {
  const agaveOracle = useContractInstance(AaveOracle__factory, 'AgaveOracle')

  const calls = [agaveOracle.getAssetsPrices] as const
  return useContractCall(
    calls,
    [[addresses]],
    `AaveOracle-getAssetsPrices-${addresses.join('-')}`,
    {
      refreshInterval: 10_000,
    },
  )
}

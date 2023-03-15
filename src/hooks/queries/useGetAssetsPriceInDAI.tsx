import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AaveOracle__factory } from '@/types/generated/typechain'

export default function useGetAssetsPriceInDAI(addresses: string[]) {
  const aaveOracle = useContractInstance(AaveOracle__factory, 'AaveOracle')

  const calls = [aaveOracle.getAssetsPrices] as const
  return useContractCall(
    calls,
    [[addresses]],
    `AaveOracle-getAssetsPrices-${addresses.join('-')}`,
    {
      refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
    },
  )
}

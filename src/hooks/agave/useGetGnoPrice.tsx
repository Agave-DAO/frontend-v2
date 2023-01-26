import { Zero } from '@ethersproject/constants'

import { agaveTokens } from '@/src/config/agaveTokens'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AaveOracle, AaveOracle__factory } from '@/types/generated/typechain'

export const useGetGnoPrice = () => {
  const gnoAddress = agaveTokens.getTokenByFieldAndValue({ symbol: 'GNO' })?.address

  if (!gnoAddress) {
    throw new Error('GNO address not found')
  }

  const aaveOracle = useContractInstance(AaveOracle__factory, 'AaveOracle')
  const calls = [aaveOracle.getAssetPrice] as const
  const [{ data: gnoPrice }, refreshGnoPrice] = useContractCall<AaveOracle, typeof calls>(
    calls,
    [[gnoAddress]],
    `getGnoPrice-${gnoAddress}`,
  )

  return { gnoPrice: gnoPrice?.[0] ?? Zero, refreshGnoPrice }
}

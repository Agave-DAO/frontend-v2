import { useContractCall } from '../useContractCall'
import { useContractInstance } from '../useContractInstance'
import {
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
} from '@/types/generated/typechain'

/**
 * Getting all market tokens
 *
 * @returns An array of token addresses
 */
export const useAllReservesTokens = () => {
  const aaveProtocolDataProvider = useContractInstance(
    AaveProtocolDataProvider__factory,
    'AaveProtocolDataProvider',
  )
  const calls = [aaveProtocolDataProvider.getAllReservesTokens] as const
  const [{ data }] = useContractCall<AaveProtocolDataProvider, typeof calls>(
    calls,
    [[]],
    'all-reserves-tokens',
  )

  return data?.[0]
}

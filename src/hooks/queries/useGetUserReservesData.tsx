import useSWR from 'swr'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useMarketVersion } from '@/src/hooks/useMarketVersion'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import {
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
} from '@/types/generated/typechain'
import { isFulfilled } from '@/types/utils'

const fetchUserReserveData = async (
  reserveAddress: string,
  userAddress: string,
  contract: AaveProtocolDataProvider,
) => {
  const userReserveData = await contract.getUserReserveData(reserveAddress, userAddress)

  return {
    reserveAddress,
    userReserveData,
  }
}

/**
 * HOOK - useUserReservesData - Fetches user reserves data for all reserve tokens in a batch request.
 */
export const useGetUserReservesData = () => {
  const { address } = useWeb3Connection()
  const [marketVersion] = useMarketVersion()

  const agaveTokens = useAgaveTokens()

  const contract = useContractInstance(
    AaveProtocolDataProvider__factory,
    'AaveProtocolDataProvider',
    { useSigner: false, batch: true },
  )

  return useSWR(address ? [`user-reserves-data`, address, marketVersion] : null, async () => {
    if (!address) {
      return null
    }

    const rawUserReservesData = await Promise.allSettled(
      agaveTokens.reserveTokens.map((token) =>
        fetchUserReserveData(token.address, address, contract),
      ),
    )

    const userReservesData = rawUserReservesData.filter(isFulfilled).map(({ value }) => value)

    return userReservesData.map(({ reserveAddress, userReserveData }) => ({
      reserveAddress,
      userReserveData,
    }))
  })
}

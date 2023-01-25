import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcBatchProvider } from '@ethersproject/providers'
import useSWR from 'swr'

import { agaveTokens } from '@/src/config/agaveTokens'
import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ChainsValues } from '@/types/chains'
import { AaveProtocolDataProvider__factory } from '@/types/generated/typechain'
import { isFulfilled } from '@/types/utils'

const fetchUserReserveData = async (
  reserveAddress: string,
  userAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  const userReserveData = await AaveProtocolDataProvider__factory.connect(
    contracts.AaveProtocolDataProvider.address[chainId],
    provider,
  ).getUserReserveData(reserveAddress, userAddress)

  return {
    reserveAddress,
    userReserveData,
  }
}

/**
 * HOOK - useUserReservesData - Fetches user reserves data for all reserve tokens in a batch request.
 */
export const useUserReservesData = () => {
  const { address, appChainId, batchProvider } = useWeb3Connection()

  return useSWR(
    address ? [`user-reserves-data`, address] : null,
    async () => {
      const reserveTokens = agaveTokens.reserveTokens

      if (!address) {
        return null
      }

      const rawUserReservesData = await Promise.allSettled(
        reserveTokens.map((token) =>
          fetchUserReserveData(token.address, address, batchProvider, appChainId),
        ),
      )

      const userReservesData = rawUserReservesData.filter(isFulfilled).map(({ value }) => value)

      return userReservesData.map(({ reserveAddress, userReserveData }) => ({
        reserveAddress,
        userReserveData,
      }))
    },
    { refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL },
  )
}

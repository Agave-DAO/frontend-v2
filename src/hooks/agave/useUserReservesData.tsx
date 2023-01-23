import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcBatchProvider } from '@ethersproject/providers'
import useSWR from 'swr'

import { agaveTokens } from '@/src/config/agaveTokens'
import { contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ChainsValues } from '@/types/chains'
import { AaveProtocolDataProvider__factory } from '@/types/generated/typechain'
import { isFulfilled } from '@/types/utils'

type ReserveData = {
  currentATokenBalance: BigNumber
  currentStableDebt: BigNumber
  currentVariableDebt: BigNumber
  principalStableDebt: BigNumber
  scaledVariableDebt: BigNumber
  stableBorrowRate: BigNumber
  liquidityRate: BigNumber
  stableRateLastUpdated: number
  usageAsCollateralEnabled: boolean
}

const fetchUserReserveData = async (
  reserveAddress: string,
  userAddress: string,
  provider: JsonRpcBatchProvider,
  chainId: ChainsValues,
) => {
  const userReserveData: ReserveData = await AaveProtocolDataProvider__factory.connect(
    contracts.AaveProtocolDataProvider.address[chainId],
    provider,
  ).getUserReserveData(reserveAddress, userAddress)

  return {
    reserveAddress,
    userReserveData,
  }
}

export const useUserReservesData = () => {
  const { address, appChainId, batchProvider } = useWeb3Connection()

  return useSWR(address ? [`user-reserves-data`, address] : null, async () => {
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
  })
}

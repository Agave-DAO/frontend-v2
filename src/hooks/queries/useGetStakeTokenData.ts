import { useMemo } from 'react'

import { WeiPerEther, Zero } from '@ethersproject/constants'

import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { AaveDistributionManager__factory, StakedToken__factory } from '@/types/generated/typechain'

/**
 * Getting the emissionPerSecond, totalStaked, stakedTokenAddress, cooldownSeconds,
 * and unstakeWindow from StakedToken contract
 */

export const useGetStakeTokenData = () => {
  const stakedTokenContract = useContractInstance(StakedToken__factory, 'StakedToken')
  const distributionManagerContract = useContractInstance(
    AaveDistributionManager__factory,
    stakedTokenContract.address,
  )

  const stakedTokenContractCalls = [
    stakedTokenContract.totalSupply,
    stakedTokenContract.STAKED_TOKEN,
    stakedTokenContract.COOLDOWN_SECONDS,
    stakedTokenContract.UNSTAKE_WINDOW,
  ] as const

  const [{ data: stakedTokenData }, refetchStakedTokenData] = useContractCall(
    stakedTokenContractCalls,
    [[], [], [], []],
    `StakedToken-totalSupply`,
  )

  const distributionManagerContractCalls = [distributionManagerContract.assets] as const

  const [{ data: stakedTokenAssetInfo }, refetchStakedTokenAssetInfo] = useContractCall(
    distributionManagerContractCalls,
    [[stakedTokenContract.address]],
    `StakedToken-assetInfo`,
  )

  return useMemo(() => {
    if (!stakedTokenAssetInfo || !stakedTokenData) {
      return {
        data: {
          emissionPerSecond: Zero,
          totalStaked: Zero,
          cooldownSeconds: Zero,
          unstakeWindow: Zero,
          stakedTokenAddress: '',
        },
        refetch: refetchStakedTokenData,
      }
    }
    const totalStaked = stakedTokenData[0]
    const emissionPerSecond = totalStaked.gt(0)
      ? stakedTokenAssetInfo[0].emissionPerSecond.mul(WeiPerEther).div(totalStaked) // emissionPerSecond in wei per second
      : stakedTokenAssetInfo[0].emissionPerSecond
    const stakedTokenAddress = stakedTokenData[1]
    const cooldownSeconds = stakedTokenData[2]
    const unstakeWindow = stakedTokenData[3]

    return {
      data: {
        emissionPerSecond,
        totalStaked,
        cooldownSeconds,
        unstakeWindow,
        stakedTokenAddress,
      },
      refetch: () => {
        refetchStakedTokenData()
        refetchStakedTokenAssetInfo()
      },
    }
  }, [refetchStakedTokenAssetInfo, refetchStakedTokenData, stakedTokenAssetInfo, stakedTokenData])
}

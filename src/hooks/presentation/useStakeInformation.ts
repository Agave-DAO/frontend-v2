import { useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { WeiPerEther } from '@ethersproject/constants'

import { useGetStakingAgvePrice } from '../queries/useGetStakingAgvePrice'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useGetStakeTokenData } from '@/src/hooks/queries/useGetStakeTokenData'
import {
  useGetUserAmountAvailableToClaim,
  useGetUserAmountAvailableToStake,
  useGetUserAmountInStake,
  useGetUserStakeCooldown,
} from '@/src/hooks/queries/useGetUserStakeData'

const MONTH_IN_SECONDS = 60 * 60 * 24 * 31
const YEAR_IN_SECONDS = 60 * 60 * 24 * 365

/**
 * This hook is used to get all the information needed to display the stake page
 * @returns
 * stakedTokenAddress: Address of the staked token
 * isCooldownActive: Boolean that indicates if the user has activated the cooldown
 * isInUnstakeWindow: Boolean that indicates if the user is in the unstake window
 * userActivateCooldownFrom: Date when the user activated the cooldown
 * userActivateCooldownTo: Date when the unstake window ends
 * userActivateCooldownReady: Date when the user can unstake
 * userAmountAvailableToStake: Amount of tokens available to stake
 * userAmountAvailableToClaim: Amount of tokens available to claim
 * userAmountStaked: Amount of tokens staked
 * yieldPerMonth: Yield per month
 * stakingAPY: Staking APY
 * totalStaked: Total amount of tokens staked
 * refetchAllStakeData: Function that refetches all the data needed to display the stake page
 */
export const useStakeInformation = () => {
  const {
    data: { cooldownSeconds, emissionPerSecond, stakedTokenAddress, totalStaked, unstakeWindow },
    refetch: refetchStakeData,
  } = useGetStakeTokenData()
  const { data: amountStaked, refetch: refetchUserAmountStaked } = useGetUserAmountInStake()
  const { data: amountAvailableToStake, refetch: refetchUserAmountAvailableToStake } =
    useGetUserAmountAvailableToStake()
  const { data: amountAvailableToClaim, refetch: refetchUserAmountAvailableToClaim } =
    useGetUserAmountAvailableToClaim()
  const { data: userStakeCooldown, refetch: refetchUserStakeCooldown } = useGetUserStakeCooldown()
  const agvePriceInUSD = useGetStakingAgvePrice()

  const yieldPerSecond = emissionPerSecond.mul(amountStaked).div(WeiPerEther)
  const yieldPerMonth = yieldPerSecond.mul(MONTH_IN_SECONDS)
  const yieldPerYear = yieldPerSecond.mul(YEAR_IN_SECONDS)

  /* Calculating the staking APY */
  const stakingAPY = amountStaked.gt(0)
    ? yieldPerYear.mul(WeiPerEther).div(amountStaked).mul(100)
    : emissionPerSecond.mul(YEAR_IN_SECONDS).mul(100)

  const currentTimeStamp = BigNumber.from((Date.now() / 1000) | 0)

  /* A boolean that indicates if the user has activated the cooldown */
  const activeCooldown = useMemo(() => {
    if (
      userStakeCooldown.gt(0) &&
      currentTimeStamp.lt(userStakeCooldown.add(cooldownSeconds).add(unstakeWindow))
    ) {
      return userStakeCooldown
    }
    return ZERO_BN
  }, [userStakeCooldown, currentTimeStamp, cooldownSeconds, unstakeWindow])

  /* A boolean that indicates if the user is in the unstake window */
  const isInUnstakeWindow = useMemo(
    () =>
      currentTimeStamp.gte(activeCooldown.add(cooldownSeconds)) &&
      currentTimeStamp.lt(userStakeCooldown.add(cooldownSeconds).add(unstakeWindow)),
    [currentTimeStamp, activeCooldown, cooldownSeconds, userStakeCooldown, unstakeWindow],
  )

  /* The date when the user activated the cooldown */
  const activateCooldownFrom = activeCooldown.gt(0)
    ? new Date(activeCooldown.toNumber() * 1000)
    : null

  /* The date when the user can unstake */
  const activateCooldownReady = activeCooldown.gt(0)
    ? new Date(activeCooldown.add(cooldownSeconds ?? 0).toNumber() * 1000)
    : null

  /* The date when the unstake window ends */
  const activateCooldownTo = activeCooldown.gt(0)
    ? new Date(
        activeCooldown
          .add(cooldownSeconds ?? 0)
          .add(unstakeWindow ?? 0)
          .toNumber() * 1000,
      )
    : null

  /**
   * Refetches all the data that's needed to display the stake page
   */
  const refetchAllStakeData = () => {
    refetchStakeData()
    refetchUserAmountStaked()
    refetchUserAmountAvailableToStake()
    refetchUserAmountAvailableToClaim()
    refetchUserStakeCooldown()
  }

  return {
    isCooldownActive: activeCooldown.gt(0),
    isInUnstakeWindow,
    stakedTokenAddress,
    activateCooldownFrom,
    activateCooldownTo,
    activateCooldownReady,
    amountAvailableToStake,
    amountAvailableToClaim,
    amountStaked,
    yieldPerMonth,
    stakingAPY,
    totalStaked,
    cooldownSeconds,
    unstakeWindow,
    agvePrice: agvePriceInUSD,
    refetchAllStakeData,
  }
}

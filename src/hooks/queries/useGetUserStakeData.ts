import { isAddress } from '@ethersproject/address'
import { Zero } from '@ethersproject/constants'
import useSWR from 'swr'

import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { useGetStakeTokenData } from '@/src/hooks/queries/useGetStakeTokenData'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { ERC20__factory, StakedToken__factory } from '@/types/generated/typechain'

/**
 *
 * @returns The amount of user staked tokens in WEI.
 */

export const useGetUserAmountInStake = () => {
  const { address } = useWeb3ConnectedApp()
  const stakedTokenContract = useContractInstance(StakedToken__factory, 'StakedToken')

  const stakedTokenContractCalls = [stakedTokenContract.balanceOf] as const

  const [{ data: userStakedAmount }, refetch] = useContractCall(
    stakedTokenContractCalls,
    [[address]],
    `StakedToken-balanceOf-${address}`,
  )

  return { data: userStakedAmount?.[0] ?? Zero, refetch }
}
/**
 *
 * @returns The amount of tokens that the user can stake in WEI.
 */

export const useGetUserAmountAvailableToStake = () => {
  const { address } = useWeb3ConnectedApp()
  const agveTokenInstance = useContractInstance(ERC20__factory, 'AGVE')

  const calls = [agveTokenInstance.balanceOf] as const

  const [{ data }, refetch] = useContractCall(calls, [[address]], `balanceOf-AGVE-${address}`)

  return { data: data?.[0] ?? Zero, refetch }
}
/**
 * @returns amount of AGAVE staked tokens that the user can claim.
 */

export const useGetUserAmountAvailableToClaim = () => {
  const { address } = useWeb3ConnectedApp()
  const stakedTokenContract = useContractInstance(StakedToken__factory, 'StakedToken')

  const stakedTokenContractCalls = [stakedTokenContract.getTotalRewardsBalance] as const

  const [{ data: userAmountClaimable }, refetch] = useContractCall(
    stakedTokenContractCalls,
    [[address]],
    `StakedToken-getClaimableRewards-${address}`,
  )

  return { data: userAmountClaimable?.[0] ?? Zero, refetch }
}
/**
 * `useGetUserStakeCooldown` returns the user's stake cooldown
 * @returns The user's stake cooldown
 */

export const useGetUserStakeCooldown = () => {
  const { address } = useWeb3ConnectedApp()

  const stakedTokenContract = useContractInstance(StakedToken__factory, 'StakedToken')

  const stakedTokenContractCalls = [stakedTokenContract.stakersCooldowns] as const

  const [{ data: userStakeCooldown }, refetch] = useContractCall(
    stakedTokenContractCalls,
    [[address]],
    `StakedToken-stakersCooldowns-${address}`,
    {
      refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
    },
  )

  return { data: userStakeCooldown?.[0] ?? Zero, refetch }
}

import { AddressZero, Zero } from '@ethersproject/constants'

import { agaveTokens } from '@/src/config/agaveTokens'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import {
  BaseIncentivesController,
  BaseIncentivesController__factory,
} from '@/types/generated/typechain'

export const useGetRewardsBalance = (userAddress: string = AddressZero) => {
  const assets = agaveTokens.allIncentivesTokens.map(({ address }) => address)

  const baseIncentivesController = useContractInstance(
    BaseIncentivesController__factory,
    'BaseIncentivesController',
  )
  const calls = [baseIncentivesController.getRewardsBalance] as const

  const [{ data: rewardsBalance }] = useContractCall<BaseIncentivesController, typeof calls>(
    calls,
    [[assets, userAddress]],
    `getRewardsBalance-${userAddress}`,
  )

  return { rewardsBalance: rewardsBalance?.[0] ?? Zero }
}

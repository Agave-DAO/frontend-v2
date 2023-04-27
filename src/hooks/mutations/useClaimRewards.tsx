import { useCallback } from 'react'

import { AddressZero, MaxUint256 } from '@ethersproject/constants'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { BaseIncentivesController__factory } from '@/types/generated/typechain'

export const useClaimRewards = (userAddress = AddressZero) => {
  const agaveTokens = useAgaveTokens()
  const baseIncentivesController = useContractInstance(
    BaseIncentivesController__factory,
    'BaseIncentivesController',
    true,
  )

  return useCallback(() => {
    const assets = agaveTokens.allIncentivesTokens.map(({ address }) => address)

    // claim rewards for all assets
    // `MaxUint256` is the maximum amount of tokens to claim, so it will claim all available tokens
    return baseIncentivesController.claimRewards(assets, MaxUint256, userAddress)
  }, [agaveTokens.allIncentivesTokens, baseIncentivesController, userAddress])
}

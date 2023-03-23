import { useState } from 'react'

import { TxButtonStyled } from '@/src/components/buttons/txButton'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { StakedToken__factory } from '@/types/generated/typechain'

export const UserStakeClaimCard = withGenericSuspense(() => {
  const { address } = useWeb3ConnectedApp()
  const { amountAvailableToClaim: userAmountAvailableToClaim, refetchAllStakeData } =
    useStakeInformation()
  const [isClaimLoading, setIsClaimLoading] = useState(false)

  const { claimRewards } = useContractInstance(StakedToken__factory, 'StakedToken')

  const submitDisabled = userAmountAvailableToClaim.isZero() || isClaimLoading

  return (
    <BaseCard style={{ flexDirection: 'column' }}>
      <p>Amount claimable:</p>
      <h2>
        <Amount decimals={18} displayDecimals={8} value={userAmountAvailableToClaim} />
      </h2>
      <TxButtonStyled
        disabled={submitDisabled}
        onFail={() => {
          setIsClaimLoading(false)
        }}
        onMined={async () => {
          await refetchAllStakeData()
          setIsClaimLoading(false)
        }}
        style={{ width: '100%' }}
        tx={() => {
          setIsClaimLoading(true)
          return claimRewards(address, userAmountAvailableToClaim)
        }}
      >
        Claim
      </TxButtonStyled>
    </BaseCard>
  )
})

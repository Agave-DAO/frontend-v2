import { ButtonPrimary } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'

export const UserStakeClaimCard = withGenericSuspense(() => {
  const { amountAvailableToClaim: userAmountAvailableToClaim } = useStakeInformation()

  return (
    <BaseCard style={{ flexDirection: 'column' }}>
      <p>Amount claimable:</p>
      <h2>
        <Amount decimals={18} displayDecimals={8} value={userAmountAvailableToClaim} />
      </h2>
      <ButtonPrimary disabled={userAmountAvailableToClaim.isZero()}>Claim</ButtonPrimary>
    </BaseCard>
  )
})

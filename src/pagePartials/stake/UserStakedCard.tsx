import { ProgressBar } from './ProgressBar'
import { ButtonPrimary } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'

export const UserStakedCard = withGenericSuspense(() => {
  const {
    activateCooldownFrom: activateCooldownFrom,
    activateCooldownReady: userActivateCooldownReady,
    activateCooldownTo: userActivateCooldownTo,
    amountStaked: userAmountStaked,
    isCooldownActive,
    isInUnstakeWindow,
  } = useStakeInformation()

  const showInitialCooldown = isCooldownActive && !isInUnstakeWindow && !!userActivateCooldownReady
  const showUnstakeWindowCooldown = isInUnstakeWindow && !!userActivateCooldownTo

  // TODO add Activate cooldown action here
  // TODO add Withdraw funds action here
  return (
    <BaseCard style={{ flexDirection: 'column' }}>
      <p>Amount staked:</p>
      <h2>
        <Amount decimals={18} displayDecimals={8} value={userAmountStaked} />
      </h2>

      {showInitialCooldown && activateCooldownFrom && (
        <div>
          <h3>Cooling down</h3>
          <p>Your tokens will be unlocked when the cooldown process is finished.</p>
          <ProgressBar end={userActivateCooldownReady} start={activateCooldownFrom} />
        </div>
      )}

      {showUnstakeWindowCooldown && userActivateCooldownReady && (
        <>
          <div>
            <h3>Unstake window</h3>
            <p>You are able to withdraw within the time frame of the unstake window.</p>
            <ProgressBar end={userActivateCooldownTo} start={userActivateCooldownReady} />
          </div>
          <ButtonPrimary>Withdraw funds</ButtonPrimary>
        </>
      )}

      {!isCooldownActive && <ButtonPrimary>Activate cooldown</ButtonPrimary>}
    </BaseCard>
  )
})

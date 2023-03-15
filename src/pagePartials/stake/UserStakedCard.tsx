import { useState } from 'react'

import { TxButtonStyled } from '@/src/components/buttons/txButton'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { ProgressBar } from '@/src/pagePartials/stake/ProgressBar'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { StakedToken__factory } from '@/types/generated/typechain'

export const UserStakedCard = withGenericSuspense(() => {
  const { address } = useWeb3ConnectedApp()
  const {
    activateCooldownFrom: activateCooldownFrom,
    activateCooldownReady: userActivateCooldownReady,
    activateCooldownTo: userActivateCooldownTo,
    amountStaked: userAmountStaked,
    isCooldownActive,
    isInUnstakeWindow,
    refetchAllStakeData,
  } = useStakeInformation()

  const [isActivateCooldownLoading, setIsActivateCooldownLoading] = useState(false)
  const [isWithdrawFundsLoading, setIsWithdrawFundsLoading] = useState(false)

  const showInitialCooldown = isCooldownActive && !isInUnstakeWindow && !!userActivateCooldownReady
  const showUnstakeWindowCooldown = isInUnstakeWindow && !!userActivateCooldownTo

  const { cooldown, redeem } = useContractInstance(StakedToken__factory, 'StakedToken')

  const ActivateCooldownButton = () => {
    const submitDisabled = isActivateCooldownLoading || userAmountStaked.isZero()

    return (
      <TxButtonStyled
        disabled={submitDisabled}
        onFail={() => {
          setIsActivateCooldownLoading(false)
        }}
        onMined={async () => {
          await refetchAllStakeData()
          setIsActivateCooldownLoading(false)
        }}
        style={{ width: '100%' }}
        tx={() => {
          setIsActivateCooldownLoading(true)
          return cooldown()
        }}
      >
        Activate cooldown
      </TxButtonStyled>
    )
  }

  const WithdrawFundsButton = () => {
    const submitDisabled = isWithdrawFundsLoading

    return (
      <TxButtonStyled
        disabled={submitDisabled}
        onFail={() => {
          setIsWithdrawFundsLoading(false)
        }}
        onMined={async () => {
          await refetchAllStakeData()
          setIsWithdrawFundsLoading(false)
        }}
        style={{ width: '100%' }}
        tx={() => {
          setIsWithdrawFundsLoading(true)
          return redeem(address, userAmountStaked)
        }}
      >
        Withdraw
      </TxButtonStyled>
    )
  }

  return (
    <BaseCard style={{ flexDirection: 'column' }}>
      <p>Amount staked:</p>
      <h2>
        <Amount
          decimals={18}
          displayDecimals={8}
          symbol="AGVE"
          symbolPosition="after"
          value={userAmountStaked}
        />
      </h2>

      {showInitialCooldown && activateCooldownFrom && (
        <div>
          <h3>Cooling down</h3>
          <p>Your tokens will be unlocked when the cooldown process is finished.</p>
          <ProgressBar end={userActivateCooldownReady} key={address} start={activateCooldownFrom} />
        </div>
      )}

      {showUnstakeWindowCooldown && userActivateCooldownReady && (
        <>
          <div>
            <h3>Unstake window</h3>
            <p>You are able to withdraw within the time frame of the unstake window.</p>
            <ProgressBar
              end={userActivateCooldownTo}
              key={`progress-${address}`}
              start={userActivateCooldownReady}
            />
          </div>
          <WithdrawFundsButton />
        </>
      )}

      {!isCooldownActive && <ActivateCooldownButton />}
    </BaseCard>
  )
})

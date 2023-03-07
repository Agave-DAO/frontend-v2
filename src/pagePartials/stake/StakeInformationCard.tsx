import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { useGetStakeTokenData } from '@/src/hooks/queries/useGetStakeTokenData'
import { secondsToString } from '@/src/utils/common'

export const StakeInformationCard = withGenericSuspense(() => {
  const { stakingAPY, totalStaked, yieldPerMonth } = useStakeInformation()

  const { cooldownSeconds, unstakeWindow } = useGetStakeTokenData().data

  return (
    <BaseCard>
      <div>
        <p> Agave per month: </p>
        <Amount
          decimals={18}
          displayDecimals={5}
          symbol="AGVE"
          symbolPosition="after"
          value={yieldPerMonth}
        />
      </div>
      <div>
        <p>Cooldown period: </p>
        {secondsToString(cooldownSeconds.toNumber())}
      </div>
      <div>
        <p>Unstake Window: </p>
        {secondsToString(unstakeWindow.toNumber())}
      </div>
      <div>
        <p>Staking APY:</p>
        <Percentage decimals={18} value={stakingAPY} />
      </div>
      <div>
        <p>Funds in the Safety Module:</p>
        <Amount
          decimals={18}
          displayDecimals={3}
          symbol="AGVE"
          symbolPosition="after"
          value={totalStaked}
        />
      </div>
    </BaseCard>
  )
})

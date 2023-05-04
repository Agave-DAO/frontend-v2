import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { CooldownPeriod, UnstakeWindow } from '@/src/pagePartials/common/tooltips'
import { fromWei, secondsToString } from '@/src/utils/common'

export const StakeInformationCard: React.FC = withGenericSuspense(({ ...restProps }) => {
  const { agvePrice, cooldownSeconds, stakingAPY, unstakeWindow, yieldPerMonth } =
    useStakeInformation()

  return (
    <Rows {...restProps}>
      <Row>
        <RowKey>Agave per month</RowKey>
        <RowValueBig>
          <Amount decimals={18} symbol="" value={yieldPerMonth} />
          &nbsp; (<Amount value={fromWei((agvePrice || ZERO_BN).mul(yieldPerMonth))} />)
        </RowValueBig>
      </Row>
      <Row variant="dark">
        <RowKey>
          Cooldown period <Tooltip content={CooldownPeriod} />
        </RowKey>
        <RowValueBig>{secondsToString(cooldownSeconds.toNumber())}</RowValueBig>
      </Row>
      <Row>
        <RowKey>
          Unstake Window <Tooltip content={UnstakeWindow} />
        </RowKey>
        <RowValueBig>{secondsToString(unstakeWindow.toNumber())}</RowValueBig>
      </Row>
      <Row variant="dark">
        <RowKey>Staking APY</RowKey>
        <RowValueBig>
          <Percentage decimals={18} value={stakingAPY} />
        </RowValueBig>
      </Row>
    </Rows>
  )
})

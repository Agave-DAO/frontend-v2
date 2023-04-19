import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { CooldownPeriod, UnstakeWindow } from '@/src/constants/tooltips'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { secondsToString } from '@/src/utils/common'

export const StakeInformationCard: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { cooldownSeconds, stakingAPY, unstakeWindow, yieldPerMonth } = useStakeInformation()

    return (
      <Rows {...restProps}>
        <Row>
          <RowKey>Agave per month</RowKey>
          <RowValueBig>
            <Amount decimals={18} symbol="" value={yieldPerMonth} />
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
  },
  ({ ...restProps }) => (
    <Rows {...restProps}>
      {Array.from({ length: 4 }).map((item, index) => (
        <SkeletonLoading
          animate={false}
          key={`list_${index}`}
          style={{ height: '53px', borderRadius: '6px' }}
        />
      ))}
    </Rows>
  ),
)

import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { secondsToString } from '@/src/utils/common'

export const StakeInformationCard: React.FC = withGenericSuspense(({ ...restProps }) => {
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
        <RowKey>Cooldown period</RowKey>
        <RowValueBig>{secondsToString(cooldownSeconds.toNumber())}</RowValueBig>
      </Row>
      <Row>
        <RowKey>Unstake Window</RowKey>
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

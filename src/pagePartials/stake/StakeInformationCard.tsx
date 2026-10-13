import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { CooldownPeriod, UnstakeWindow } from '@/src/pagePartials/common/tooltips'
import { secondsToString } from '@/src/utils/common'

export const StakeInformationCard: React.FC = withGenericSuspense(({ ...restProps }) => {
  const { cooldownSeconds, unstakeWindow } = useStakeInformation()

  return (
    <Rows {...restProps}>
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
    </Rows>
  )
})

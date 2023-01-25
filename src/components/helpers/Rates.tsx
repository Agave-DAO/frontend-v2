import { BigNumber } from 'ethers'

import { CustomHR, Grid } from '../../pagePartials/markets/MarketList'
import { Percentage } from '@/src/components/helpers/Percentage'

export const Rates = ({
  base,
  incentive,
  total,
}: {
  base: BigNumber
  incentive: BigNumber
  total: BigNumber
}) => (
  <div>
    <Grid>
      Total rate: <Percentage decimals={25} value={total} />
    </Grid>
    <CustomHR />
    <Grid>
      Base rate: <Percentage decimals={25} value={base} />
    </Grid>
    <Grid>
      Incentive rate: <Percentage decimals={25} value={incentive} />
    </Grid>
  </div>
)

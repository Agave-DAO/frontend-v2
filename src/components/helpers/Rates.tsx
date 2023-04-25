import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { Percentage } from '@/src/components/helpers/Percentage'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'

export const CustomHR = styled.hr`
  margin: 15px 0;
`
export const Grid = styled(SimpleGrid)`
  align-items: center;
  column-gap: 20px;
  display: flex;
  row-gap: 20px;
  > * {
    flex: 1;
    text-align: center;
  }
`

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
      Total: <Percentage decimals={25} value={total} />
    </Grid>
    <Grid>
      Base: <Percentage decimals={25} value={base} />
    </Grid>
    <Grid>
      Incentive: <Percentage decimals={25} value={incentive} />
    </Grid>
  </div>
)

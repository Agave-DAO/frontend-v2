import styled from 'styled-components'

import { BigNumber } from 'ethers'

import { Percentage } from '@/src/components/helpers/Percentage'

export const CustomHR = styled.hr`
  margin: 15px 0;
`
export const Grid = styled.div`
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

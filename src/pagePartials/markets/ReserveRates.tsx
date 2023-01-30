import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Percentage } from '@/src/components/helpers/Percentage'
import { Rates } from '@/src/components/helpers/Rates'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { useAgaveMarketsData } from '@/src/hooks/agave/useAgaveMarketsData'

const Grid = styled(SimpleGrid)`
  justify-content: center;
`

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

export function ReserveRates({ tokenAddress }: { tokenAddress: string }) {
  const marketData = useAgaveMarketsData([tokenAddress])

  return (
    <BaseCard>
      <Column>
        <Grid>
          <div>Deposit APY</div>
          <Rates
            base={marketData.getDepositAPY(tokenAddress)}
            incentive={marketData.getIncentiveRate(tokenAddress, 'ag')}
            total={marketData
              .getDepositAPY(tokenAddress)
              .add(marketData.getIncentiveRate(tokenAddress, 'ag'))}
          />
        </Grid>
        <Grid>
          <div>Stable Borrowing APR</div>
          <Percentage decimals={25} value={marketData.getBorrowRate(tokenAddress).stable} />
        </Grid>
        <Grid>
          <div>Variable Borrowing APR</div>
          <Rates
            base={marketData.getBorrowRate(tokenAddress).variable}
            incentive={marketData.getIncentiveRate(tokenAddress, 'variableDebt')}
            total={marketData
              .getBorrowRate(tokenAddress)
              .variable.sub(marketData.getIncentiveRate(tokenAddress, 'variableDebt'))}
          />
        </Grid>
      </Column>
    </BaseCard>
  )
}

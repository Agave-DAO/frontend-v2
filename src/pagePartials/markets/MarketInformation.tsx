import styled from 'styled-components'

import { Zero } from '@ethersproject/constants'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useAgaveMarketsData } from '@/src/hooks/agave/useAgaveMarketsData'

const Grid = styled(SimpleGrid)`
  justify-content: center;
`

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

export function MarketInformation({ tokenAddress }: { tokenAddress: string }) {
  const { getMarket } = useAgaveMarketsData([tokenAddress])
  const { assetData, priceData } = getMarket(tokenAddress)

  const usedAsCollateral = assetData.usageAsCollateralEnabled ? assetData.ltv.gt(Zero) : false

  return (
    <BaseCard>
      <BaseTitle>Market Information</BaseTitle>
      <Column>
        <Grid>
          <div>Price</div>
          <div>
            <Amount value={priceData} />
          </div>
        </Grid>
        <Grid>
          <div>Maximum LTV</div>
          <Percentage decimals={2} value={assetData.ltv} />
        </Grid>
        <Grid>
          <div>Liquidity Threshold</div>
          <Percentage decimals={2} value={assetData.liquidationThreshold} />
        </Grid>
        <Grid>
          <div>Liquidation Penalty</div>
          <Percentage decimals={2} value={assetData.liquidationBonus.sub(10_000)} />
        </Grid>
        <Grid>
          <div>Reserve Factor</div>
          <Percentage decimals={2} value={assetData.reserveFactor} />
        </Grid>
        <Grid>
          <div>Used as Collateral</div>
          <div>{usedAsCollateral ? 'Yes' : 'No'}</div>
        </Grid>
        <Grid>
          <div>Stable Borrowing</div>
          <div>{assetData.stableBorrowRateEnabled ? 'Yes' : 'No'}</div>
        </Grid>
      </Column>
    </BaseCard>
  )
}

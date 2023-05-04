import styled from 'styled-components'

import { Zero } from '@ethersproject/constants'

import { Ok } from '@/src/components/assets/Ok'
import { Row, RowKey, RowValue, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { InnerTitle } from '@/src/components/text/InnerTitle'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useGetReserveLimits } from '@/src/hooks/queries/useGetReserveLimits'
import {
  LiquidityPenalty,
  LiquidityThreshold,
  MaximumLTV,
} from '@/src/pagePartials/common/tooltips'
import { TokenCapValue } from '@/src/pagePartials/markets/TokenCapValue'

const Title = styled(InnerTitle)`
  margin-bottom: 32px;
`

export function MarketInformation({ tokenAddress }: { tokenAddress: string }) {
  const { getMarket } = useMarketsData()
  const { assetData, priceData } = getMarket(tokenAddress)
  const {
    data: { borrowLimit, depositLimit },
  } = useGetReserveLimits(tokenAddress)

  const usedAsCollateral = assetData.usageAsCollateralEnabled ? assetData.ltv.gt(Zero) : false

  return (
    <>
      <Title>Market Information</Title>
      <Rows>
        <Row>
          <RowKey>Price</RowKey>
          <RowValue>
            <Amount value={priceData} />
          </RowValue>
        </Row>
        <Row variant="dark">
          <RowKey>
            Maximum LTV <Tooltip content={MaximumLTV} />
          </RowKey>
          <RowValue>
            <Percentage decimals={2} value={assetData.ltv} />
          </RowValue>
        </Row>
        <Row>
          <RowKey>
            Liquidity Threshold <Tooltip content={LiquidityThreshold} />
          </RowKey>
          <RowValue>
            <Percentage decimals={2} value={assetData.liquidationThreshold} />
          </RowValue>
        </Row>
        <Row variant="dark">
          <RowKey>
            Liquidation Penalty <Tooltip content={LiquidityPenalty} />
          </RowKey>
          <RowValue>
            <Percentage decimals={2} value={assetData.liquidationBonus.sub(10_000)} />
          </RowValue>
        </Row>
        <Row>
          <RowKey>Reserve Factor</RowKey>
          <RowValue>
            <Percentage decimals={2} value={assetData.reserveFactor} />
          </RowValue>
        </Row>
        <Row variant="dark">
          <RowKey>Deposit Cap</RowKey>
          <RowValue>
            <TokenCapValue limit={depositLimit} priceData={priceData} tokenAddress={tokenAddress} />
          </RowValue>
        </Row>
        <Row>
          <RowKey>Borrow Cap</RowKey>
          <RowValue>
            <TokenCapValue limit={borrowLimit} priceData={priceData} tokenAddress={tokenAddress} />
          </RowValue>
        </Row>
        <Row variant="dark">
          <RowKey>Used as Collateral</RowKey>
          <RowValue>{usedAsCollateral ? <Ok /> : 'No'}</RowValue>
        </Row>
        <Row>
          <RowKey>Stable Borrowing</RowKey>
          <RowValue>{assetData.stableBorrowRateEnabled ? <Ok /> : 'No'}</RowValue>
        </Row>
      </Rows>
    </>
  )
}

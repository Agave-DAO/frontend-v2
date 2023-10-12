import styled from 'styled-components'

import { InnerCardDark } from '@/src/components/common/InnerCard'
import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { useGetSavingsData } from '@/src/hooks/queries/useGetSavingsData'
import { formatAmount, formatPercentage } from '@/src/utils/common'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

export const InfoTable: React.FC = withGenericSuspense(
  () => {
    const { totalAssets, totalSupply, vaultAPY } = useGetSavingsData()

    return (
      <Wrapper>
        <InnerCardDark>
          <Rows>
            <Row variant="light">
              <RowKey>Total Supply</RowKey>
              <RowValueBig>{formatAmount(totalSupply, 18, '')} sDAI</RowValueBig>
            </Row>
            <Row variant="light">
              <RowKey>Total Reserves</RowKey>
              <RowValueBig>{formatAmount(totalAssets, 18, '$')} WXDAI</RowValueBig>
            </Row>
            <Row variant="light">
              <RowKey>Vault APY</RowKey>
              <RowValueBig>{formatPercentage(vaultAPY, 16)}</RowValueBig>
            </Row>
          </Rows>
        </InnerCardDark>
      </Wrapper>
    )
  },
  () => (
    <SkeletonLoading
      style={{
        borderRadius: '16px',
        height: '205px',
        marginBottom: '20px',
      }}
    />
  ),
)

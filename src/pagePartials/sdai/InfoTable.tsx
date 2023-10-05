import styled from 'styled-components'

import { InnerCardDark } from '@/src/components/common/InnerCard'
import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { useGetSavingsData } from '@/src/hooks/queries/useGetSavingsData'

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`

export const InfoTable: React.FC = () => {
  const { totalAssets, totalSupply, vaultAPY } = useGetSavingsData()

  return (
    <Wrapper>
      <InnerCardDark>
        <Rows>
          <Row variant="light">
            <RowKey>Shares</RowKey>
            <RowValueBig>{totalSupply} sDAI</RowValueBig>
          </Row>
          <Row variant="light">
            <RowKey>Reserves</RowKey>
            <RowValueBig>{totalAssets} WXDAI</RowValueBig>
          </Row>
          <Row variant="light">
            <RowKey>Vault APY</RowKey>
            <RowValueBig>{vaultAPY} %</RowValueBig>
          </Row>
        </Rows>
      </InnerCardDark>
    </Wrapper>
  )
}

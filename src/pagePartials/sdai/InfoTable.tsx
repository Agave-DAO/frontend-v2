import styled from 'styled-components'

import { InnerCardDark } from '@/src/components/common/InnerCard'
import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'

const Wrapper = styled.div`
  width: 100%;
`

interface Props {
  symbol: string | undefined
}

export const InfoTable: React.FC<Props> = ({ symbol, ...restProps }) => {
  // TODO
  const inDsr = '?'
  const dsrRate = '?'

  return (
    <Wrapper {...restProps}>
      <InnerCardDark>
        <Rows>
          <Row variant="light">
            <RowKey>{symbol} in DSR</RowKey>
            <RowValueBig>
              {inDsr} {symbol}
            </RowValueBig>
          </Row>
          <Row variant="light">
            <RowKey>DSR Rate</RowKey>
            <RowValueBig>{dsrRate} %</RowValueBig>
          </Row>
        </Rows>
      </InnerCardDark>
    </Wrapper>
  )
}

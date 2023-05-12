import React from 'react'
import styled from 'styled-components'

import { Row as BaseRow, RowKey, RowValue, Rows } from '@/src/components/card/FormCard'

const Wrapper = styled(Rows)`
  padding: var(--padding-xxxl) 0 var(--padding-xxl);
  row-gap: 6px;
`

const Row = styled(BaseRow)`
  padding-bottom: 0;
  padding-top: 0;
`

const Key = styled(RowKey)`
  color: ${({ theme: { colors } }) => colors.darkerGray};
`

const Value = styled(RowValue)`
  color: ${({ theme: { colors } }) => colors.darkerGray};
`

export const Details: React.FC<{
  data: Array<{ key: string | React.ReactNode; value: string | React.ReactNode }>
}> = ({ data, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {data.map(({ key, value }, index) => (
        <Row key={index}>
          <Key>{key}</Key>
          <Value>{value}</Value>
        </Row>
      ))}
    </Wrapper>
  )
}

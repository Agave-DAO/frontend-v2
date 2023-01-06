import styled from 'styled-components'

export const TwoColumnsGrid = styled.div<{ alignItems?: string }>`
  align-items: ${({ alignItems }) => alignItems};
  column-gap: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
`

TwoColumnsGrid.defaultProps = {
  alignItems: 'center',
}

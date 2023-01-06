import styled from 'styled-components'

export const SimpleGrid = styled.div<{ alignItems?: string }>`
  align-items: ${({ alignItems }) => alignItems};
  column-gap: 20px;
  display: flex;
  row-gap: 20px;
`

SimpleGrid.defaultProps = {
  alignItems: 'center',
}

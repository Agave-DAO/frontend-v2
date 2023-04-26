import styled from 'styled-components'

export const LegendColor = styled.div<{ color: string; size?: number }>`
  --legend-color-size: ${({ size }) => size}px;

  background-color: ${({ color }) => color};
  border-radius: 50%;
  height: var(--legend-color-size);
  width: var(--legend-color-size);
`

LegendColor.defaultProps = {
  size: 7,
}

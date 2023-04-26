import styled from 'styled-components'

export const AssetsList = styled.div<{ maxWidth?: string }>`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
  margin: 0 auto;
  max-width: ${({ maxWidth }) => maxWidth};
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    gap: 24px;
    grid-template-columns: 1fr 1fr;
  }
`

AssetsList.defaultProps = {
  maxWidth: '952px',
}

import styled from 'styled-components'

export const InnerCard = styled.div`
  background-color: ${({ theme: { colors } }) => colors.primary10};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    border-radius: 16px;
  }
`

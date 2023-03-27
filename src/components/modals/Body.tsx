import styled from 'styled-components'

export const Body = styled.div`
  display: flex;
  flex-grow: 1;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background: linear-gradient(
      180deg,
      ${({ theme: { colors } }) => colors.darkBackground02} 0%,
      ${({ theme: { colors } }) => colors.darkBackground0} 25.31%
    );
    border-radius: 24px;
    padding: 56px 95px;
  }
`

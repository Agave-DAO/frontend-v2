import styled from 'styled-components'

export const BaseTitle = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 24px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 3.2rem;
    margin-bottom: 32px;
  }
`

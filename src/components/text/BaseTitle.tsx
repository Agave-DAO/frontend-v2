import styled from 'styled-components'

export const BaseTitle = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 30px;
`

import styled from 'styled-components'

export const BaseParagraph = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 16px;
  max-width: 100%;
`

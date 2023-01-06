import styled from 'styled-components'

export const BaseParagraph = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 0 0 20px;
  max-width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`

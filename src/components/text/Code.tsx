import styled from 'styled-components'

export const Code = styled.span`
  background-color: #fafafa;
  border-radius: 3px;
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  color: #bb0000;
  font-family: ${({ theme: { fonts } }) => fonts.familyCode};
  font-size: 1.3rem;
  line-height: 1.2;
  padding: 0 5px;
`

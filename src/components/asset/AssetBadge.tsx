import styled from 'styled-components'

export const AssetBadge = styled.div`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.mainDark3};
  border-radius: 6px;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.2rem;
  font-weight: 400;
  height: 21px;
  line-height: 1.2;
  margin-left: auto;
  padding: 0 8px;
  text-transform: capitalize;
`

import styled from 'styled-components'

export const BaseCard = styled.div`
  background-color: ${({ theme: { card } }) => card.backgroundColor};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
  border: 1px solid ${({ theme: { card } }) => card.borderColor};
  padding: ${({ theme: { card } }) => card.paddingVertical}
    ${({ theme: { card } }) => card.paddingHorizontal};
  width: 100%;
`

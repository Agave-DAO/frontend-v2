import styled from 'styled-components'

export const InnerCard = styled.div`
  --padding: 16px;

  background-color: ${({ theme: { colors } }) => colors.primary10};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: var(--padding);
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    border-radius: 16px;
  }
`

export const InnerCardDark = styled(InnerCard)`
  background-color: ${({ theme: { colors } }) => colors.secondary30};
  padding-left: 8px;
  padding-right: 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    padding-left: var(--padding);
    padding-right: var(--padding);
  }
`

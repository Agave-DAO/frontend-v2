import styled, { css } from 'styled-components'

export const InnerCardCSS = css`
  --inner-card-padding: var(--padding-md);

  background-color: ${({ theme: { colors } }) => colors.primary10};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: var(--inner-card-padding);
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    border-radius: 16px;
  }
`

export const InnerCard = styled.div`
  ${InnerCardCSS}
`

export const InnerCardDarkCSS = css`
  background-color: ${({ theme: { colors } }) => colors.secondary30};
  padding-left: 8px;
  padding-right: 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    padding-left: var(--inner-card-padding);
    padding-right: var(--inner-card-padding);
  }
`

export const InnerCardDark = styled(InnerCard)`
  ${InnerCardDarkCSS}
`

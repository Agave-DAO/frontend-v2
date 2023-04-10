import styled, { css } from 'styled-components'

export const InnerCardCSS = css`
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

export const InnerCard = styled.div`
  ${InnerCardCSS}
`

export const InnerCardDarkCSS = css`
  background-color: ${({ theme: { colors } }) => colors.secondary30};
  padding-left: 8px;
  padding-right: 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    padding-left: var(--padding);
    padding-right: var(--padding);
  }
`

export const InnerCardDark = styled(InnerCard)`
  ${InnerCardDarkCSS}
`

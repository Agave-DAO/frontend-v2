import styled, { css } from 'styled-components'

export const BaseTitle = styled.h1<{ hasExtraControls?: boolean }>`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 24px;
  word-break: break-word;

  ${({ hasExtraControls }) =>
    hasExtraControls &&
    css`
      align-items: center;
      column-gap: 16px;
      display: flex;
      justify-content: space-between;
    `}

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 3.2rem;
    margin-bottom: 32px;
  }
`

BaseTitle.defaultProps = {
  hasExtraControls: false,
}

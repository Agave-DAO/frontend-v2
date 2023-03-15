import styled from 'styled-components'

export const OuterContainer = styled.div`
  --outer-container-horizontal-padding: 16px;
  --outer-container-top-padding: 54px;
  --outer-container-bottom-padding: 32px;

  background-color: ${({ theme: { colors } }) => colors.mainDark4};
  display: flex;
  flex-direction: column;
  margin-left: -${({ theme: { layout } }) => layout.horizontalPaddingMobile};
  margin-right: -${({ theme: { layout } }) => layout.horizontalPaddingMobile};
  padding: var(--outer-container-top-padding) var(--outer-container-horizontal-padding)
    var(--outer-container-bottom-padding);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --outer-container-horizontal-padding: 95px;
    --outer-container-top-padding: 80px;
    --outer-container-bottom-padding: 40px;

    background-color: ${({ theme: { colors } }) => colors.mainDark450};
    border-radius: 24px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
`

import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 44px;
  }
`

const Title = styled.div`
  color: ${({ theme: { colors } }) => colors.white60};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 4px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

const ValuesWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const TokenValue = styled.div`
  color: ${({ theme: { colors } }) => colors.tetxColor};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.1rem;
  }
`

const UsdValue = styled.div`
  color: ${({ theme: { colors } }) => colors.tetxColor};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

export const AssetInfo: React.FC<{
  tokenValue: React.ReactNode
  usdValue: React.ReactNode
  title: string
}> = ({ title, tokenValue, usdValue, ...restProps }) => (
  <Wrapper {...restProps}>
    <Title>{title}</Title>
    <ValuesWrapper>
      <TokenValue>{tokenValue}</TokenValue>
      <UsdValue>{usdValue}</UsdValue>
    </ValuesWrapper>
  </Wrapper>
)

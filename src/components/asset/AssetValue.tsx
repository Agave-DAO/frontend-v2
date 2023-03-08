import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2px;
`

const TokenValue = styled.h3`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.1rem;
  }
`

const USDValue = styled.span`
  color: ${({ theme: { colors } }) => colors.gray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

export interface Props {
  tokenValue: string | React.ReactNode
  usdValue: string | React.ReactNode
}

export const AssetValue: React.FC<Props> = ({ tokenValue, usdValue, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <TokenValue>{tokenValue}</TokenValue>
      <USDValue>{usdValue}</USDValue>
    </Wrapper>
  )
}

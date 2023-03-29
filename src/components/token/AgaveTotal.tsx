import styled from 'styled-components'

import { TokenIcon } from '@/src/components/token/TokenIcon'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 24px;
  padding: 16px 0 0 0;
  width: 100%;
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 8px;
`

const Values = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const Agave = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 8px;
`

const Usd = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;
`

export const AgaveTotal: React.FC<{
  title: string
  agave: string | React.ReactNode | number
  usd: string | React.ReactNode | number
}> = ({ agave, title, usd, ...restProps }) => (
  <Wrapper {...restProps}>
    <Title>{title}</Title>
    <Values>
      <Agave>
        <TokenIcon dimensions={25} symbol="AGVE" />
        {agave}
      </Agave>
      <Usd>{usd}</Usd>
    </Values>
  </Wrapper>
)

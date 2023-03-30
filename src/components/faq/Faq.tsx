import styled from 'styled-components'

import { Item, Items } from '@/src/components/faq/Item'
import { OuterContainer } from '@/src/components/layout/OuterContainer'

const Wrapper = styled(OuterContainer)`
  background-color: ${({ theme: { colors } }) => colors.black};
  padding-bottom: 40px;
  padding-top: 40px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    background-color: ${({ theme: { colors } }) => colors.black60};
    padding-bottom: 80px;
    padding-top: 80px;
  }
`

const Title = styled.h2`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 2.4rem;
  }
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.white60};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 32px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.8rem;
  }

  a {
    color: ${({ theme: { colors } }) => colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

export const Faq: React.FC<{
  title?: string
  data: Array<{ title: string; content: React.ReactNode }>
}> = ({ data, title = 'Frequently Asked Questions', ...restProps }) => (
  <Wrapper {...restProps}>
    <Title>{title}</Title>
    <Text>
      Read the{' '}
      <a
        href="https://agavedev.notion.site/agavedev/Agave-Docs-a0cb462422b941d89a6dc646cdb1bdf8"
        rel="noreferrer"
        target="_blank"
      >
        full documentation
      </a>
    </Text>
    <Items>
      {data.map((item, index) => (
        <Item data={item} key={index} />
      ))}
    </Items>
  </Wrapper>
)

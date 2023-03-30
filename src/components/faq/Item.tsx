import { useState } from 'react'
import styled, { css } from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'

export const Items = styled.div`
  display: grid;
  row-gap: 16px;
`

const Head = styled.div`
  align-items: center;
  border-bottom: 1px solid transparent;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: var(--padding);
  transition: border-color 0.15s linear;
`

const Title = styled.h3`
  color: ${({ theme: { colors } }) => colors.white60};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  transition: color 0.15s linear;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.8rem;
  }
`

const Chevron = styled(ChevronDown)`
  transition: all 0.15s linear;
`

const Content = styled.div<{ isOpen?: boolean }>`
  color: ${({ theme: { colors } }) => colors.white60};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.6;
  padding: var(--padding) var(--padding) 24px var(--padding);
  transition: color 0.15s linear;
  word-break: break-word;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.6rem;
  }

  p {
    margin: 0;
  }

  ul {
    margin: 0;
    padding: 0 0 0 8px;
  }

  li {
    list-style: none;
    padding: 0;

    &::before {
      content: '•';
      color: ${({ theme: { colors } }) => colors.primary};
      margin: 0 8px 0 0;
    }
  }

  a {
    color: ${({ theme: { colors } }) => colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    color: #990000;
    font-size: 1.3rem;
    line-height: 1.2;
    padding: 3px 5px;
  }
`

const Wrapper = styled.div<{ isOpen?: boolean }>`
  --padding: 16px;

  background: ${({ isOpen, theme: { colors } }) =>
    isOpen ? colors.lightestGray : colors.secondary};
  border-radius: 8px;
  box-shadow: 0px 19px 51px rgba(0, 0, 0, 0.05), 0px 9.61875px 22.2328px rgba(0, 0, 0, 0.03375),
    0px 3.8px 8.2875px rgba(0, 0, 0, 0.025), 0px 0.83125px 2.94844px rgba(0, 0, 0, 0.01625);
  transition: all 0.25s linear;

  ${({ isOpen }) =>
    isOpen &&
    css`
      ${Head} {
        border-bottom-color: ${({ theme: { colors } }) => colors.borderColor};
      }

      ${Title} {
        color: ${({ theme: { colors } }) => colors.secondary};
        font-weight: 700;
      }

      ${Chevron} {
        transform: rotate(180deg);

        path {
          fill: ${({ theme: { colors } }) => colors.secondary};
        }
      }

      ${Content} {
        color: ${({ theme: { colors } }) => colors.secondary};
      }
    `}
`

export const Item: React.FC<{ data: { title: string; content: React.ReactNode } }> = ({
  data,
  ...restProps
}) => {
  const { content, title } = data
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper isOpen={isOpen} {...restProps}>
      <Head onClick={() => setIsOpen(!isOpen)}>
        <Title>{title}</Title>
        <Chevron />
      </Head>
      {isOpen && <Content>{content}</Content>}
    </Wrapper>
  )
}

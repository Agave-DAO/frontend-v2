import React from 'react'
import styled, { keyframes } from 'styled-components'

import { LogoMini } from '@/src/components/assets/LogoMini'

const hoveringAnimation = keyframes`
  0% {
    top: 0;
  }

  25% {
    top: 2px;
  }

  50% {
    top: 0;
  }

  75% {
    top: -2px;
  }

  100% {
    top: 0;
  }
`

const Wrapper = styled.div`
  align-items: center;
  aspect-ratio: 4 / 4;
  background-color: ${({ theme: { colors } }) => colors.primary10};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding: 32px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    aspect-ratio: 4 / 3;
    max-width: 400px;
  }
`

const Icon = styled.div`
  animation: ${hoveringAnimation} 2s ease-in-out infinite;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
`

const Logo = styled(LogoMini)`
  --size: 50px;

  animation-iteration-count: infinite;
  height: var(--size);
  width: var(--size);
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 8px;
  text-align: center;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.2rem;
    margin-bottom: 16px;
  }
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: center;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }

  a {
    color: ${({ theme: { colors } }) => colors.textColor};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`

export const GenericError: React.FC<{
  title?: string
  text?: string | React.ReactNode
  icon?: React.ReactNode
}> = ({ icon = <Logo />, text = 'Something went wrong.', title = 'Error', ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      <Text>{text}</Text>
    </Wrapper>
  )
}

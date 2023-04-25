import React, { createRef, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

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
  background-color: ${({ theme: { colors } }) => colors.primary10};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding: 32px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
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
  word-break: break-word;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.2rem;
    margin-bottom: 16px;
  }
`

const MessageWrapper = styled.div<{
  maxHeight?: number
  showAll?: boolean
  togglerActive?: boolean
}>`
  cursor: ${({ togglerActive }) => (togglerActive ? 'pointer' : 'auto')};
  overflow: hidden;
  position: relative;

  ${({ maxHeight, showAll, togglerActive }) =>
    !togglerActive
      ? css`
          max-height: none;
        `
      : showAll
      ? css`
          max-height: none;
        `
      : css`
          max-height: ${maxHeight}px;
        `};

  ${({ showAll, theme: { colors }, togglerActive }) =>
    togglerActive &&
    !showAll &&
    css`
      &::after {
        align-items: center;
        background-color: ${colors.primaryLight};
        border-radius: 15px;
        bottom: 0;
        color: ${colors.textColor};
        content: 'Show more';
        cursor: pointer;
        display: flex;
        font-size: 1.2rem;
        padding: 0 8px;
        position: absolute;
        right: 50%;
        transform: translateX(50%);
      }
    `};
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  word-break: break-word;

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
  const maxHeight = 196
  const [showAll, setShowAll] = useState(false)
  const [togglerActive, setAllTogglerActive] = useState(false)
  const node = createRef<HTMLParagraphElement>()

  useEffect(() => {
    if (node.current) {
      if (node.current.clientHeight > maxHeight) {
        setAllTogglerActive(true)
      }
    }
  }, [node])

  return (
    <Wrapper {...restProps}>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      <MessageWrapper
        maxHeight={maxHeight}
        onClick={() => {
          if (togglerActive) {
            setShowAll(!showAll)
          } else {
            return
          }
        }}
        showAll={showAll}
        togglerActive={togglerActive}
      >
        <Text ref={node}>{text}</Text>
      </MessageWrapper>
    </Wrapper>
  )
}

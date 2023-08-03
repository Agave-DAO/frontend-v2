import React, { HTMLAttributes, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { FeedbackTypes } from '@/types/feedback'

interface WrapperProps {
  isFading: boolean
}

const Svg = styled.svg`
  .fill {
    fill: ${({ theme: { colors } }) => colors.error};
  }
`

export const FeedbackError: React.FC<HTMLAttributes<SVGElement>> = ({
  className,
  ...restProps
}) => (
  <Svg
    className={className}
    fill="none"
    height="25"
    viewBox="0 0 25 25"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      d="M11.852 24.293c1.609 0 3.12-.309 4.535-.926a11.855 11.855 0 003.75-2.531 12.203 12.203 0 002.543-3.75c.617-1.422.925-2.938.925-4.547 0-1.61-.308-3.121-.925-4.535a12.021 12.021 0 00-2.543-3.75 11.76 11.76 0 00-3.75-2.543A11.295 11.295 0 0011.84.785c-1.61 0-3.125.309-4.547.926a11.797 11.797 0 00-3.738 2.543 12.02 12.02 0 00-2.543 3.75C.402 9.418.098 10.93.098 12.539c0 1.61.304 3.125.914 4.547a12.203 12.203 0 002.543 3.75 12.033 12.033 0 003.75 2.531c1.422.617 2.937.926 4.547.926zm0-1.512c-1.422 0-2.75-.265-3.985-.797a10.347 10.347 0 01-3.258-2.203 10.346 10.346 0 01-2.203-3.258 10.154 10.154 0 01-.785-3.984c0-1.414.262-2.738.785-3.973a10.409 10.409 0 012.192-3.27 10.093 10.093 0 013.257-2.202 10.025 10.025 0 013.985-.797c1.422 0 2.75.265 3.984.797a10.092 10.092 0 013.258 2.203 10.217 10.217 0 012.215 3.27 9.942 9.942 0 01.797 3.972c0 1.414-.266 2.742-.797 3.984a10.185 10.185 0 01-2.192 3.258 10.31 10.31 0 01-3.27 2.203c-1.241.532-2.57.797-3.983.797zM7.75 17.38a.713.713 0 00.55-.246l3.54-3.551 3.562 3.55a.725.725 0 001.055.036.74.74 0 00.211-.527.72.72 0 00-.223-.528l-3.562-3.562 3.574-3.574a.72.72 0 00.223-.528.701.701 0 00-.211-.515.716.716 0 00-.528-.211c-.187 0-.359.082-.515.246L11.84 11.53 8.29 7.97a.734.734 0 00-.54-.223.727.727 0 00-.516.211c-.14.133-.21.3-.21.504 0 .203.074.375.222.516l3.563 3.574-3.563 3.574a.683.683 0 00-.223.516c0 .203.07.379.211.527.149.14.32.21.516.21z"
      fill="#aa4444"
    ></path>
  </Svg>
)

export const FeedbackSuccess: React.FC<HTMLAttributes<SVGElement>> = ({
  className,
  ...restProps
}) => (
  <Svg
    className={className}
    fill="none"
    height="25"
    viewBox="0 0 25 25"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <g>
      <path
        clipRule="evenodd"
        d="M12.5 1.67594C6.52206 1.67594 1.67594 6.52206 1.67594 12.5C1.67594 18.4779 6.52206 23.324 12.5 23.324C18.4779 23.324 23.324 18.4779 23.324 12.5C23.324 6.52206 18.4779 1.67594 12.5 1.67594ZM0 12.5C0 5.60647 5.60647 0 12.5 0C19.3935 0 25 5.60647 25 12.5C25 19.3935 19.3935 25 12.5 25C5.60647 25 0 19.3935 0 12.5Z"
        fill="#019d8b"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M17.985 7.84854C18.4493 8.31326 18.4493 9.06673 17.985 9.53145L11.37 16.1515C10.9056 16.6162 10.1527 16.6162 9.68834 16.1515L6.68153 13.1424C6.21716 12.6776 6.21716 11.9242 6.68153 11.4595C7.1459 10.9947 7.8988 10.9947 8.36317 11.4595L10.5292 13.6271L16.3033 7.84854C16.7677 7.38382 17.5206 7.38382 17.985 7.84854Z"
        fill="#019d8b"
        fillRule="evenodd"
      />
    </g>
  </Svg>
)

export const FeedbackWarning: React.FC<HTMLAttributes<SVGElement>> = ({
  className,
  ...restProps
}) => (
  <Svg
    className={className}
    fill="none"
    height="25"
    viewBox="0 0 25 25"
    width="25"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <g>
      <path
        clipRule="evenodd"
        d="M12.5 1.67594C6.52206 1.67594 1.67594 6.52206 1.67594 12.5C1.67594 18.4779 6.52206 23.324 12.5 23.324C18.4779 23.324 23.324 18.4779 23.324 12.5C23.324 6.52206 18.4779 1.67594 12.5 1.67594ZM0 12.5C0 5.60647 5.60647 0 12.5 0C19.3935 0 25 5.60647 25 12.5C25 19.3935 19.3935 25 12.5 25C5.60647 25 0 19.3935 0 12.5Z"
        fill="#0D2026"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M12.5001 6.99721C12.9636 6.99721 13.3382 7.3718 13.3382 7.83529V12.4999C13.3382 12.9634 12.9636 13.338 12.5001 13.338C12.0366 13.338 11.662 12.9634 11.662 12.4999V7.83529C11.662 7.3718 12.0366 6.99721 12.5001 6.99721Z"
        fill="#0D2026"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M11.662 17.1648C11.662 16.7013 12.0366 16.3267 12.5001 16.3267H12.5147C12.9782 16.3267 13.3528 16.7013 13.3528 17.1648C13.3528 17.6283 12.9782 18.0029 12.5147 18.0029H12.5001C12.0366 18.0029 11.662 17.6283 11.662 17.1648Z"
        fill="#0D2026"
        fillRule="evenodd"
      />
    </g>
  </Svg>
)

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`

const Wrapper = styled.div<WrapperProps>`
  align-items: center;
  border-radius: 10px;
  border: 2px solid #0d2026;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: auto 10px;
  padding: 10px;

  ${({ isFading }) =>
    isFading &&
    css`
      animation: ${fadeOut} 0.2s forwards;
    `}
`

const Icon = styled.div`
  animation: 2s ease-in-out infinite;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const MessageWrapper = styled.div`
  overflow: hidden;
  position: relative;
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.gray};
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 8px;
  text-align: left;
  word-break: break-word;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
    margin-bottom: 5px;
  }
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.gray};
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: left;
  word-break: break-word;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }

  a {
    color: ${({ theme: { colors } }) => colors.textColor};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`

export const FeedbackBanner: React.FC<{
  title?: string
  text?: string | React.ReactNode
  type?: FeedbackTypes
}> = ({ text = '', title = '', type = 'warning', ...restProps }) => {
  let IconComponent
  const [isFading, setIsFading] = useState(false)
  const [isRendered, setIsRendered] = useState(true)

  useEffect(() => {
    if (isFading) {
      setTimeout(() => setIsRendered(false), 500)
    }
  }, [isFading])

  switch (type) {
    case 'success':
      IconComponent = FeedbackSuccess
      break
    case 'error':
      IconComponent = FeedbackError
      break
    case 'warning':
    default:
      IconComponent = FeedbackWarning
      break
  }

  if (!isRendered) return null

  return (
    <Wrapper {...restProps} isFading={isFading} onClick={() => setIsFading(true)}>
      {IconComponent ? (
        <Icon>
          <IconComponent />
        </Icon>
      ) : (
        ''
      )}
      <ContentWrapper>
        <Title>{title}</Title>
        <MessageWrapper>
          <Text>{text}</Text>
        </MessageWrapper>
      </ContentWrapper>
    </Wrapper>
  )
}

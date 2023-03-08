import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const Alert: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`alert ${className}`}
    fill="none"
    height="50"
    viewBox="0 0 50 50"
    width="50"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <g opacity="0.6">
      <path
        clipRule="evenodd"
        d="M25 3.35187C13.0441 3.35187 3.35187 13.0441 3.35187 25C3.35187 36.9559 13.0441 46.6481 25 46.6481C36.9559 46.6481 46.6481 36.9559 46.6481 25C46.6481 13.0441 36.9559 3.35187 25 3.35187ZM0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25Z"
        fill="#0D2026"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M25.0002 13.9944C25.9257 13.9944 26.6761 14.7447 26.6761 15.6703V24.9999C26.6761 25.9255 25.9257 26.6759 25.0002 26.6759C24.0746 26.6759 23.3242 25.9255 23.3242 24.9999V15.6703C23.3242 14.7447 24.0746 13.9944 25.0002 13.9944Z"
        fill="#0D2026"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M23.3242 34.3297C23.3242 33.4041 24.0746 32.6538 25.0002 32.6538H25.0235C25.9491 32.6538 26.6994 33.4041 26.6994 34.3297C26.6994 35.2553 25.9491 36.0057 25.0235 36.0057H25.0002C24.0746 36.0057 23.3242 35.2553 23.3242 34.3297Z"
        fill="#0D2026"
        fillRule="evenodd"
      />
    </g>
  </Wrapper>
)

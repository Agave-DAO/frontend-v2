import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const More: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`more ${className}`}
    fill="none"
    height="10"
    viewBox="0 0 4 10"
    width="4"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      clipRule="evenodd"
      d="M3.1 1.3a1.1 1.1 0 10-2.2 0 1.1 1.1 0 002.2 0zM3.1 5A1.1 1.1 0 10.9 5a1.1 1.1 0 002.2 0zM3.1 8.7a1.1 1.1 0 10-2.2 0 1.1 1.1 0 002.2 0z"
      fill="#fff"
      fillRule="evenodd"
    />
  </Wrapper>
)

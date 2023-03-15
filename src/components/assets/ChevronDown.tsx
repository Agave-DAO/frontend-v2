import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const ChevronDown: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`chevronDown ${className}`}
    fill="none"
    height="6"
    viewBox="0 0 8 6"
    width="8"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      clipRule="evenodd"
      d="M0.167368 0.837511C0.390524 0.609705 0.752333 0.609705 0.97549 0.837511L4 3.92503L7.02451 0.837511C7.24767 0.609705 7.60948 0.609705 7.83263 0.837511C8.05579 1.06532 8.05579 1.43466 7.83263 1.66247L4.40406 5.16247C4.1809 5.39028 3.8191 5.39028 3.59594 5.16247L0.167368 1.66247C-0.0557892 1.43466 -0.0557892 1.06532 0.167368 0.837511Z"
      fill="white"
      fillRule="evenodd"
    />
  </Wrapper>
)

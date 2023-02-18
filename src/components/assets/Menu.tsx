import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const Menu: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`menu ${className}`}
    fill="none"
    height="20"
    viewBox="0 0 26 20"
    width="26"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <g className="stroke" fill="none" strokeWidth="3">
      <path
        d="M21.2729 4.20447H4.7271C4.32555 4.20447 4 4.62168 4 5.13629C4 5.65091 4.32555 6.06812 4.7271 6.06812H21.2729C21.6745 6.06812 22 5.65091 22 5.13629C22 4.62168 21.6745 4.20447 21.2729 4.20447Z"
        fill="white"
      />
      <path
        d="M21.2729 9.06812H4.7271C4.32555 9.06812 4 9.48528 4 9.99994C4 10.5146 4.32555 10.9318 4.7271 10.9318H21.2729C21.6745 10.9318 22 10.5146 22 9.99994C22 9.48532 21.6745 9.06812 21.2729 9.06812Z"
        fill="white"
      />
      <path
        d="M21.2729 13.9318H4.7271C4.32555 13.9318 4 14.3489 4 14.8636C4 15.3782 4.32555 15.7954 4.7271 15.7954H21.2729C21.6745 15.7954 22 15.3782 22 14.8636C22 14.3489 21.6745 13.9318 21.2729 13.9318Z"
        fill="white"
      />
    </g>
  </Wrapper>
)

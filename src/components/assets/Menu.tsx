import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
  width: 30px;

  .stroke {
    stroke: ${({ theme }) => theme.header.color};
  }
`

export const Menu: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`menu ${className}`}
    height="29"
    viewBox="0 0 29 36"
    width="36"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <g className="stroke" fill="none" strokeWidth="3">
      <path d="M0 1.5h36" />
      <path d="M0 14.5h36" />
      <path d="M0 27.5h36" />
    </g>
  </Wrapper>
)

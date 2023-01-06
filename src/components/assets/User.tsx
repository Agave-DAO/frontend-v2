import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme }) => theme.header.color};
  }

  .stroke {
    stroke: ${({ theme }) => theme.header.color};
  }
`

export const User: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`user ${className}`}
    height="30"
    viewBox="0 0 30 30"
    width="30"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <g transform="translate(-1251 -10)">
      <g className="stroke" fill="none" strokeWidth="1" transform="translate(1251 10)">
        <circle cx="15" cy="15" r="15" stroke="none" />
        <circle cx="15" cy="15" fill="none" r="14.5" />
      </g>
      <path
        className="fill"
        d="M198.788,153.71a9.029,9.029,0,0,0-6.359-8.079,6.265,6.265,0,1,0-5.292,0,9.029,9.029,0,0,0-6.359,8.079.517.517,0,0,0,.516.549h0a.518.518,0,0,0,.516-.482,7.989,7.989,0,0,1,15.949,0,.517.517,0,0,0,1.031-.067Zm-14.24-13.758a5.233,5.233,0,1,1,5.233,5.233A5.233,5.233,0,0,1,184.548,139.953Z"
        transform="translate(1076.588 -117.325)"
      />
    </g>
  </Wrapper>
)

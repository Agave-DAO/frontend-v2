import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const Close: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`close ${className}`}
    fill="none"
    height="9"
    width="9"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill"
      d="M.372 8.225a.455.455 0 00.425.112.423.423 0 00.195-.112L4.117 5.1l3.125 3.125a.438.438 0 00.42.112.374.374 0 00.2-.112.388.388 0 00.108-.196.438.438 0 000-.224.388.388 0 00-.108-.196L4.737 4.48l3.125-3.125a.438.438 0 000-.615.4.4 0 00-.2-.112.438.438 0 00-.224 0 .373.373 0 00-.196.112L4.117 3.864.992.74a.374.374 0 00-.2-.112.438.438 0 00-.225 0 .373.373 0 00-.195.112.423.423 0 00-.112.196.523.523 0 000 .224c.02.075.057.14.112.195L3.497 4.48.372 7.61a.423.423 0 00-.112.196.477.477 0 00-.005.224c.02.075.058.14.117.196z"
    />
  </Wrapper>
)

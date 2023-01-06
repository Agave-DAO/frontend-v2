import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { dropdown } }) => dropdown.item.color};
  }
`

export const Logout: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`logout ${className}`}
    height="11.655"
    viewBox="0 0 12 11.655"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill"
      d="M12.182,21.944,10.894,20.7a.53.53,0,1,1,.722-.776l.015.014,2.207,2.135a.531.531,0,0,1,.012.751L11.642,25.1a.53.53,0,0,1-.76-.738L12.2,23H6.945a.531.531,0,0,1,0-1.061ZM3.06,27.2H9.594a.53.53,0,0,1,0,1.059H2.531A.53.53,0,0,1,2,27.726v-10.6a.531.531,0,0,1,.531-.531H9.594a.531.531,0,0,1,0,1.061H3.059Z"
      fill="#fff"
      transform="translate(-2 -16.6)"
    />
  </Wrapper>
)

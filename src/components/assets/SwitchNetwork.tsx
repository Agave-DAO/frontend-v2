import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { dropdown } }) => dropdown.item.color};
  }
`

export const SwitchNetwork: React.FC<HTMLAttributes<SVGElement>> = ({
  className,
  ...restProps
}) => (
  <Wrapper
    className={`switchNetwork ${className}`}
    height="10.306"
    viewBox="0 0 12 10.306"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill"
      d="M109.221,162.738H98.379a.579.579,0,0,0-.478.907.588.588,0,0,0,.122.18l2.554,2.552a.58.58,0,0,0,.82-.82l-1.663-1.66h9.485a.579.579,0,0,0,0-1.159Zm-10.841-2.689h10.841a.579.579,0,0,0,.478-.907.6.6,0,0,0-.084-.138l-2.089-2.552a.58.58,0,0,0-.9.734l1.395,1.7H98.379a.579.579,0,1,0,0,1.159Z"
      transform="translate(-97.8 -156.24)"
    />
  </Wrapper>
)

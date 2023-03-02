import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const ChevronRight: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`chevronRight ${className}`}
    fill="none"
    height="8"
    viewBox="0 0 6 8"
    width="6"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      clipRule="evenodd"
      d="M0.837602 7.83263C0.609797 7.60948 0.609797 7.24767 0.837602 7.02451L3.92512 4L0.837602 0.975489C0.609796 0.752333 0.609796 0.390524 0.837602 0.167367C1.06541 -0.05579 1.43475 -0.05579 1.66256 0.167367L5.16256 3.59594C5.39037 3.81909 5.39037 4.1809 5.16256 4.40406L1.66256 7.83263C1.43475 8.05579 1.06541 8.05579 0.837602 7.83263Z"
      fill="white"
      fillRule="evenodd"
    />
  </Wrapper>
)

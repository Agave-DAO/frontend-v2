import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg<{ isOpen?: boolean }>`
  display: block;
  flex-shrink: 0;
  transition: transform 0.15s ease-in-out;

  ${({ isOpen }) => isOpen && 'transform: rotate(180deg);'}
`

interface Props extends HTMLAttributes<SVGElement> {
  isOpen?: boolean
}

export const CollapseToggle: React.FC<Props> = ({ className, isOpen, ...restProps }) => (
  <Wrapper
    className={`collapseToggle ${className}`}
    fill="none"
    height="12"
    isOpen={isOpen}
    viewBox="0 0 12 12"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <rect fill="#0D2026" height="12" rx="6" width="12" />
    <path
      d="M6 6.55088L3.80305 4.30816C3.59647 4.09728 3.26067 4.09728 3.05409 4.30816C2.84864 4.5179 2.84864 4.8571 3.05409 5.06684L5.62552 7.69184C5.8321 7.90272 6.1679 7.90272 6.37448 7.69184L8.94591 5.06684C9.15136 4.8571 9.15136 4.5179 8.94591 4.30816C8.73933 4.09728 8.40353 4.09728 8.19695 4.30816L6 6.55088Z"
      fill="#019D8B"
      stroke="#019D8B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="0.2"
    />
  </Wrapper>
)

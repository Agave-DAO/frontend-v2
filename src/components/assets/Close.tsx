import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const Close: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`close ${className}`}
    fill="none"
    height="16"
    viewBox="0 0 15 16"
    width="15"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      d="M14.1615 13.1909L2.46189 1.49128C2.17795 1.20734 1.65274 1.27215 1.28885 1.63604C0.924963 1.99993 0.860149 2.52514 1.14409 2.80908L12.8437 14.5087C13.1277 14.7927 13.6529 14.7279 14.0168 14.364C14.3807 14.0001 14.4455 13.4749 14.1615 13.1909Z"
      fill="white"
    />
    <path
      d="M2.46249 14.5087L14.1621 2.80909C14.4461 2.52515 14.3813 1.99994 14.0174 1.63605C13.6535 1.27216 13.1283 1.20735 12.8443 1.49129L1.14468 13.1909C0.860718 13.4749 0.925557 14.0001 1.28945 14.364C1.65334 14.7279 2.17852 14.7927 2.46249 14.5087Z"
      fill="white"
    />
  </Wrapper>
)

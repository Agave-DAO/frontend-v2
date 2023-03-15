import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const Ok: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`ok ${className}`}
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <rect fill="#40B390" height="16" rx="8" width="16" />
    <path
      clipRule="evenodd"
      d="M12.0827 5.19253C12.3534 5.44924 12.3534 5.86545 12.0827 6.12215L7.14283 10.8075C6.87217 11.0642 6.43335 11.0642 6.1627 10.8075L3.91729 8.67778C3.64663 8.42107 3.64663 8.00487 3.91729 7.74816C4.18794 7.49145 4.62676 7.49145 4.89742 7.74816L6.65276 9.41304L11.1026 5.19253C11.3733 4.93582 11.8121 4.93582 12.0827 5.19253Z"
      fill="#122C34"
      fillRule="evenodd"
    />
  </Wrapper>
)

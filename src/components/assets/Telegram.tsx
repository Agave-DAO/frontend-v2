import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const Telegram: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`telegram ${className}`}
    fill="none"
    height="14"
    viewBox="0 0 16 14"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill"
      d="M15.2279 2.01367L13.0339 12.3603C12.8684 13.0906 12.4367 13.2723 11.8233 12.9283L8.48045 10.465L6.86744 12.0163C6.68893 12.1948 6.53964 12.3441 6.19562 12.3441L6.43578 8.93958L12.6315 3.34108C12.9008 3.10091 12.573 2.96785 12.2128 3.20802L4.55339 8.03084L1.25595 6.99877C0.538698 6.77483 0.525716 6.28151 1.40525 5.93749L14.3029 0.968616C14.9001 0.744676 15.4226 1.10168 15.2279 2.01367Z"
      fill="white"
    />
  </Wrapper>
)

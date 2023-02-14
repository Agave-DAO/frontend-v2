import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const Medium: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`medium ${className}`}
    fill="none"
    height="12"
    viewBox="0 0 16 12"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill"
      d="M2.51306 2.62253C2.5309 2.44711 2.46252 2.2717 2.3317 2.15277L0.99081 0.535381V0.294556H5.15916L8.38206 7.36173L11.2155 0.294556H15.1906V0.535381L14.0429 1.63545C13.9448 1.70977 13.8943 1.83465 13.9151 1.95655V10.0435C13.8943 10.1654 13.9448 10.2903 14.0429 10.3646L15.1638 11.4647V11.7055H9.52374V11.4647L10.6862 10.3378C10.7992 10.2249 10.7992 10.1892 10.7992 10.0167V3.48177L7.56741 11.6847H7.13036L3.3723 3.48177V8.97912C3.3396 9.21103 3.4169 9.44293 3.58042 9.60943L5.09078 11.4409V11.6817H0.809448V11.4439L2.31981 9.60943C2.48036 9.44293 2.55469 9.20805 2.51306 8.97912V2.62253Z"
      fill="white"
    />
  </Wrapper>
)

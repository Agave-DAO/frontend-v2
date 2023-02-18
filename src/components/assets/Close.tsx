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
    height="14"
    viewBox="0 0 14 14"
    width="14"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      d="M13.5317 12.2138L1.83201 0.514138C1.54807 0.230196 1.02286 0.295011 0.65897 0.658901C0.295081 1.02279 0.230266 1.548 0.514208 1.83194L12.2139 13.5316C12.4978 13.8156 13.023 13.7507 13.3869 13.3868C13.7508 13.0229 13.8156 12.4978 13.5317 12.2138Z"
      fill="white"
    />
    <path
      d="M1.8326 13.5316L13.5322 1.83195C13.8162 1.54801 13.7514 1.0228 13.3875 0.658909C13.0236 0.29502 12.4984 0.230205 12.2144 0.514147L0.514802 12.2138C0.230835 12.4978 0.295674 13.0229 0.659564 13.3868C1.02345 13.7507 1.54864 13.8156 1.8326 13.5316Z"
      fill="white"
    />
  </Wrapper>
)

import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
`

export const Done: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`done ${className}`}
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <rect fill="white" height="24" rx="11.5" width="23" x="0.833252" />
    <path
      clipRule="evenodd"
      d="M17.985 7.84854C18.4493 8.31326 18.4493 9.06673 17.985 9.53145L11.37 16.1515C10.9056 16.6162 10.1527 16.6162 9.68834 16.1515L6.68153 13.1424C6.21716 12.6776 6.21716 11.9242 6.68153 11.4595C7.1459 10.9947 7.8988 10.9947 8.36317 11.4595L10.5292 13.6271L16.3033 7.84854C16.7677 7.38382 17.5206 7.38382 17.985 7.84854Z"
      fill="#122C34"
      fillRule="evenodd"
    />
  </Wrapper>
)

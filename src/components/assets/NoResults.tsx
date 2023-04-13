import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  display: block;
  flex-shrink: 0;
`

export const NoResults: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`noResults ${className}`}
    fill="none"
    height="77"
    viewBox="0 0 80 77"
    width="80"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <circle cx="36.3726" cy="36" r="35" stroke="#F0F4F4" strokeWidth="2" />
    <path
      d="M60.3474 61.0277C59.809 61.5953 59.8327 62.4919 60.4003 63.0303L73.577 75.5287C74.1446 76.0671 75.0411 76.0434 75.5795 75.4758C76.1179 74.9082 76.0942 74.0116 75.5266 73.4733L62.3499 60.9748C61.7823 60.4364 60.8858 60.4601 60.3474 61.0277Z"
      fill="#F0F4F4"
    />
    <circle cx="36.3726" cy="36" fill="url(#paint0_linear_1348_7112)" fillOpacity="0.1" r="36" />
    <path
      d="M36.0734 19.2994C40.0843 19.2275 43.9872 20.6016 47.0685 23.1703C50.1498 25.7391 52.2037 29.331 52.8547 33.2895C53.5056 37.2479 52.7102 41.3084 50.6139 44.7287C48.5175 48.149 45.2602 50.7005 41.4375 51.9169C37.6147 53.1333 33.4819 52.9332 29.7945 51.3533C26.1071 49.7734 23.1115 46.9192 21.3552 43.3124C19.599 39.7056 19.1995 35.5873 20.2298 31.7102C21.2601 27.8332 23.6513 24.4564 26.9663 22.1973"
      stroke="#9BEFD7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <circle
      cx="31.0912"
      cy="20.0926"
      fill="#9BEFD7"
      r="0.695969"
      transform="rotate(30 31.0912 20.0926)"
    />
    <path
      d="M36.3726 29.7364L41.7971 39.132H30.9481L36.3726 29.7364Z"
      stroke="#9BEFD7"
      strokeLinejoin="round"
      strokeWidth="4"
    />
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        id="paint0_linear_1348_7112"
        x1="36.3726"
        x2="36.3726"
        y1="2.57263"
        y2="58.2293"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </Wrapper>
)

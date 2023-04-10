import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { renderToStaticMarkup } from 'react-dom/server'

const Wrapper = styled.span`
  cursor: pointer;
`

const TooltipIconSVG = ({ ...props }) => (
  <svg
    fill="none"
    height="12"
    viewBox="0 0 13 12"
    width="13"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect fill="white" height="12" rx="6" width="12" x="0.5" />
    <path
      d="M6.50669 2C5.37259 2 4.63804 2.46691 4.06133 3.29962C3.95672 3.45067 3.98897 3.65778 4.13491 3.76897L4.74782 4.23597C4.89521 4.34827 5.10491 4.32201 5.2203 4.17675C5.5762 3.72871 5.84021 3.47075 6.39614 3.47075C6.83324 3.47075 7.3739 3.75343 7.3739 4.17935C7.3739 4.50133 7.10938 4.6667 6.67779 4.90984C6.17449 5.19339 5.50845 5.54627 5.50845 6.42903V6.56878C5.50845 6.75803 5.66112 6.91144 5.84945 6.91144H6.87915C7.06748 6.91144 7.22015 6.75803 7.22015 6.56878V6.48635C7.22015 5.87442 9 5.84894 9 4.19301C9.00001 2.94597 7.71271 2 6.50669 2ZM6.36431 8.02199C5.82161 8.02199 5.38008 8.46566 5.38008 9.011C5.38008 9.55633 5.82161 10 6.36431 10C6.90701 10 7.34854 9.55633 7.34854 9.01099C7.34854 8.46565 6.90701 8.02199 6.36431 8.02199Z"
      fill="#019D8B"
    />
  </svg>
)

const TooltipIcon = styled(TooltipIconSVG)`
  outline: none;
`

interface Props extends HTMLAttributes<HTMLSpanElement> {
  content: React.ReactElement | string
}

export const Tooltip = ({ children, content, ...restProps }: Props) => {
  const tooltipContent = typeof content === 'string' ? content : renderToStaticMarkup(content)

  return (
    <Wrapper data-tooltip-html={tooltipContent} data-tooltip-id="mainTooltip" {...restProps}>
      {children ? children : <TooltipIcon />}
    </Wrapper>
  )
}

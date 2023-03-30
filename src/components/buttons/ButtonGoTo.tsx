import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { ChevronRight } from '@/src/components/assets/ChevronRight'

const Wrapper = styled.button`
  --button-size: 40px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.primary};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: var(--button-size);
  justify-content: center;
  padding: 0;
  text-decoration: none;
  transition: all 0.15s linear;
  user-select: none;
  width: var(--button-size);

  &:hover {
    background-color: ${({ theme: { colors } }) => colors.primaryDarkened};
  }

  &:active {
    opacity: 0.7;
  }
`

export const ButtonGoTo: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ ...restProps }) => (
  <Wrapper {...restProps}>
    <ChevronRight />
  </Wrapper>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AGoTo = React.forwardRef(function CustomComponent(props, ref) {
  return (
    <Wrapper as="a" {...props}>
      <ChevronRight />
    </Wrapper>
  )
})

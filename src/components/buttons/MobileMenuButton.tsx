import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { ActiveButtonCSS, DisabledButtonCSS } from '@/src/components/buttons/Button'

const Wrapper = styled.button<{ isOpen?: boolean }>`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: block;
  flex-direction: column;
  height: 12px;
  justify-content: flex-end;
  padding: 0;
  position: relative;
  position: relative;
  user-select: none;
  width: var(--mobile-menu-min-width);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    display: none;
  }

  ${ActiveButtonCSS}

  &[disabled],
  &[disabled]:hover {
    ${DisabledButtonCSS}
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      height: 14px;
      width: 13px;

      .line {
        &.line1 {
          left: 1px;
          transform: rotate(45deg);
        }

        &.line2 {
          opacity: 0;
        }

        &.line3 {
          bottom: -1px;
          left: -1px;
          top: auto;
          transform: rotate(-45deg);
        }
      }
    `}
`

const Line = styled.span`
  background-color: #fff;
  border-radius: 1px;
  display: block;
  height: 2px;
  left: 0;
  position: absolute;
  transition: all var(--mobile-menu-transition-time) linear;
  width: var(--mobile-menu-min-width);

  &.line1 {
    top: 0;
    transform-origin: 0 0;
  }

  &.line2 {
    opacity: 1;
    top: 5px;
  }

  &.line3 {
    top: 10px;
    transform-origin: 0 0;
  }
`

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean
}

export const MobileMenuButton: React.FC<Props> = ({ isOpen, ...restProps }) => (
  <Wrapper isOpen={isOpen} {...restProps}>
    <Line className="line line1" />
    <Line className="line line2" />
    <Line className="line line3" />
  </Wrapper>
)

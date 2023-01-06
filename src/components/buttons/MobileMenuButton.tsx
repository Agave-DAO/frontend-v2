import { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { Menu } from '@/src/components/assets/Menu'
import { ActiveButtonCSS, DisabledButtonCSS } from '@/src/components/buttons/Button'

const Wrapper = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 0;
  user-select: none;
  width: 40px;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    display: none;
  }

  ${ActiveButtonCSS}

  &[disabled],
  &[disabled]:hover {
    ${DisabledButtonCSS}
  }
`

export const MobileMenuButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <Wrapper {...props}>
    <Menu />
  </Wrapper>
)

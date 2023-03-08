import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { ChevronRight } from '@/src/components/assets/ChevronRight'
import {
  ButtonDark as BaseButtonDark,
  ButtonLight as BaseButtonLight,
  ButtonPrimary as BaseButtonPrimary,
} from '@/src/components/buttons/Button'

export const ButtonCSS = css`
  --border-radius: 20px;
  --font-size: 1.4rem;
  --height: 36px;
  --padding: 12px;

  border-radius: var(--border-radius);
  font-size: var(--font-size);
  height: var(--height);
  padding-left: var(--padding);
  padding-right: var(--padding);
  width: fit-content;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --border-radius: 30px;
    --font-size: 1.6rem;
    --height: 46px;
    --padding: 16px;
  }
`

const Wrapper = styled.button``

const ButtonPrimary = styled(BaseButtonPrimary)`
  ${ButtonCSS}
`

const ButtonDark = styled(BaseButtonDark)`
  ${ButtonCSS}
`

const ButtonLight = styled(BaseButtonLight)`
  ${ButtonCSS}

  svg > path {
    fill: ${({ theme: { colors } }) => colors.mainDark1};
  }

  &:hover {
    svg > path {
      fill: #fff;
    }
  }

  &:disabled:hover {
    svg > path {
      fill: ${({ theme: { colors } }) => colors.mainDark1};
    }
  }
`

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'light'
}

export const ActionButton: React.FC<Props> = ({ children, variant = 'primary', ...restProps }) => (
  <Wrapper
    as={variant === 'light' ? ButtonLight : variant === 'dark' ? ButtonDark : ButtonPrimary}
    {...restProps}
  >
    {children} <ChevronRight />
  </Wrapper>
)

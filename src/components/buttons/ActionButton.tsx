import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { ChevronRight } from '@/src/components/assets/ChevronRight'
import {
  ButtonDark as BaseButtonDark,
  ButtonLight as BaseButtonLight,
  ButtonPrimary as BaseButtonPrimary,
  ButtonUltraLight as BaseButtonUltraLight,
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

const Wrapper = styled.button`
  ${ButtonCSS}
`

const ButtonPrimary = styled(BaseButtonPrimary)`
  svg > path,
  &:disabled:hover svg > path {
    fill: ${({ theme: { buttonPrimary } }) => buttonPrimary.color};
  }

  &:hover {
    svg > path {
      fill: ${({ theme: { buttonPrimary } }) => buttonPrimary.colorHover};
    }
  }
`

const ButtonDark = styled(BaseButtonDark)`
  svg > path,
  &:disabled:hover svg > path {
    fill: ${({ theme: { buttonDark } }) => buttonDark.color};
  }

  &:hover {
    svg > path {
      fill: ${({ theme: { buttonDark } }) => buttonDark.colorHover};
    }
  }
`

const ButtonLight = styled(BaseButtonLight)`
  svg > path,
  &:disabled:hover svg > path {
    fill: ${({ theme: { buttonLight } }) => buttonLight.color};
  }

  &:hover {
    svg > path {
      fill: ${({ theme: { buttonLight } }) => buttonLight.colorHover};
    }
  }
`

const ButtonUltraLight = styled(BaseButtonUltraLight)`
  svg > path,
  &:disabled:hover svg > path {
    fill: ${({ theme: { buttonUltraLight } }) => buttonUltraLight.color};
  }

  &:hover {
    svg > path {
      fill: ${({ theme: { buttonUltraLight } }) => buttonUltraLight.colorHover};
    }
  }
`

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'light' | 'ultraLight'
}

export const ActionButton: React.FC<Props> = ({ children, variant = 'primary', ...restProps }) => (
  <Wrapper
    as={
      variant === 'light'
        ? ButtonLight
        : variant === 'dark'
        ? ButtonDark
        : variant === 'ultraLight'
        ? ButtonUltraLight
        : ButtonPrimary
    }
    {...restProps}
  >
    {children} <ChevronRight />
  </Wrapper>
)

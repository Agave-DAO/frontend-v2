import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { ChevronRight } from '@/src/components/assets/ChevronRight'
import {
  ButtonDark as BaseButtonDark,
  ButtonDarker as BaseButtonDarker,
  ButtonLight as BaseButtonLight,
  ButtonPrimary as BaseButtonPrimary,
  ButtonUltraLight as BaseButtonUltraLight,
} from '@/src/components/buttons/Button'

export const ButtonCSS = css`
  --border-radius: 20px;
  --font-size: 1.4rem;
  --height: 36px;
  --padding: var(--padding-sm-md);

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
    --padding: var(--padding-md);
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

const ButtonDarker = styled(BaseButtonDarker)`
  svg > path,
  &:disabled:hover svg > path {
    fill: ${({ theme: { buttonDarker } }) => buttonDarker.color};
  }

  &:hover {
    svg > path {
      fill: ${({ theme: { buttonDarker } }) => buttonDarker.colorHover};
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
  variant?: 'primary' | 'dark' | 'darker' | 'light' | 'ultraLight'
}

export const ActionButton: React.FC<Props> = ({ children, variant = 'primary', ...restProps }) => (
  <Wrapper
    as={
      variant === 'light'
        ? ButtonLight
        : variant === 'dark'
        ? ButtonDark
        : variant === 'darker'
        ? ButtonDarker
        : variant === 'ultraLight'
        ? ButtonUltraLight
        : ButtonPrimary
    }
    {...restProps}
  >
    <span>{children}</span> <ChevronRight />
  </Wrapper>
)

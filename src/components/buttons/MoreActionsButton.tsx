import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { More } from '@/src/components/assets/More'
import {
  ButtonLight as BaseButtonLight,
  ButtonNeutral as BaseButtonNeutral,
  ButtonPrimary as BaseButtonPrimary,
  ButtonPrimaryDark as BaseButtonPrimaryDark,
} from '@/src/components/buttons/Button'

const CommonCSS = css`
  --padding: 12px;

  padding-left: var(--padding);
  padding-right: var(--padding);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --padding: 16px;
  }
`

const SizeCSS = css`
  --border-radius: 20px;
  --font-size: 1.4rem;
  --height: 36px;

  border-radius: var(--border-radius);
  font-size: var(--font-size);
  height: var(--height);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --border-radius: 30px;
    --font-size: 1.6rem;
    --height: 46px;
  }
`

const Wrapper = styled.button<{ size?: Size }>`
  ${CommonCSS}
  ${({ size }) => size === 'lg' && SizeCSS}
`

Wrapper.defaultProps = {
  className: 'moreActionsButton',
}

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

const ButtonPrimaryDark = styled(BaseButtonPrimaryDark)`
  svg > path,
  &:disabled:hover svg > path {
    fill: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.color};
  }

  &:hover {
    svg > path {
      fill: ${({ theme: { buttonPrimaryDark } }) => buttonPrimaryDark.colorHover};
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

const ButtonNeutral = styled(BaseButtonNeutral)`
  svg > path,
  &:disabled:hover svg > path {
    fill: ${({ theme: { buttonNeutral } }) => buttonNeutral.color};
  }

  &:hover {
    svg > path {
      fill: ${({ theme: { buttonNeutral } }) => buttonNeutral.colorHover};
    }
  }
`

export type Size = 'md' | 'lg'
export type Variant = 'primary' | 'dark' | 'light' | 'neutral'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const MoreActionsButton: React.FC<Props> = ({
  children,
  size = 'md',
  variant,
  ...restProps
}) => (
  <Wrapper
    as={
      variant === 'light'
        ? ButtonLight
        : variant === 'primary'
        ? ButtonPrimary
        : variant === 'neutral'
        ? ButtonNeutral
        : ButtonPrimaryDark
    }
    size={size}
    {...restProps}
  >
    {children} <More />
  </Wrapper>
)

import styled, { css } from 'styled-components'

import { BaseButton, DisabledButtonCSS } from '@/src/components/buttons/Button'

export const ButtonGradientCSS = css`
  background-image: ${({ theme: { buttonGradient } }) => buttonGradient.backgroundImage};
  border: none;
  color: ${({ theme: { buttonGradient } }) => buttonGradient.color};

  &:hover {
    background-image: ${({ theme: { buttonGradient } }) => buttonGradient.backgroundImageHover};
    color: ${({ theme: { buttonGradient } }) => buttonGradient.colorHover};
    opacity: 0.8;
  }

  ${DisabledButtonCSS}

  &[disabled],
  &[disabled]:hover {
    background-image: ${({ theme: { buttonGradient } }) => buttonGradient.backgroundImage};
    color: ${({ theme: { buttonGradient } }) => buttonGradient.color};
  }
`

export const ButtonGradient = styled(BaseButton)`
  ${ButtonGradientCSS}
`

ButtonGradient.defaultProps = {
  borderRadiusVariant: 'fullyRounded',
}

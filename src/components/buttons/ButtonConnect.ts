import styled from 'styled-components'

import { ButtonGradient } from '@/src/components/buttons/ButtonGradient'

export const ButtonConnect = styled(ButtonGradient)`
  font-size: 1.6rem;
  font-weight: 700;
  height: 54px;

  color: ${({ theme: { buttonConnect } }) => buttonConnect.color};

  &:hover {
    color: ${({ theme: { buttonConnect } }) => buttonConnect.colorHover};
  }
`

ButtonConnect.defaultProps = {
  borderRadiusVariant: 'round',
}

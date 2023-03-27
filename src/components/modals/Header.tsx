import styled from 'styled-components'

import { Close as BaseClose } from '@/src/components/assets/Close'
import { LogoMini } from '@/src/components/assets/LogoMini'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--header-full-height);
  justify-content: space-between;
  margin-bottom: 40px;
  padding-top: var(--header-padding-top);
`

const Logo = styled(LogoMini)`
  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 46px;
    width: 48px;
  }
`

const Close = styled(BaseClose)`
  cursor: pointer;

  &:active {
    opacity: 0.7;
  }
`

export const Header: React.FC<{ onClose: () => void }> = ({ onClose, ...restProps }) => (
  <Wrapper
    onClick={(e) => {
      e.stopPropagation()
    }}
    {...restProps}
  >
    <Logo />
    <Close onClick={onClose} tabIndex={-1} />
  </Wrapper>
)

import Link from 'next/link'
import styled from 'styled-components'

import { Logo as BaseLogoSVG } from '@/src/components/assets/Logo'

const HomeLink = styled.a`
  transition: opacity 0.05s linear;

  &:active {
    opacity: 0.7;
  }
`

const LogoSVG = styled(BaseLogoSVG)`
  cursor: pointer;
  width: 55px;
`

export const Logo: React.FC = (props) => (
  <Link href="/" legacyBehavior passHref>
    <HomeLink {...props}>
      <LogoSVG />
    </HomeLink>
  </Link>
)

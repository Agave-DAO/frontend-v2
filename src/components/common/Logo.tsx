import Link from 'next/link'
import styled from 'styled-components'

import { Logo as LogoSVG } from '@/src/components/assets/Logo'

const HomeLink = styled.a`
  cursor: pointer;
  transition: opacity 0.15s linear;

  &:active {
    opacity: 0.7;
  }
`

export const Logo: React.FC = (props) => (
  <Link href="/#main" legacyBehavior passHref scroll={true}>
    <HomeLink {...props}>
      <LogoSVG />
    </HomeLink>
  </Link>
)

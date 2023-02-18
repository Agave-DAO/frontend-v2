import styled from 'styled-components'

import { Logo } from '@/src/components/common/Logo'
import { SocialLinks } from '@/src/components/common/SocialLinks'
import { InnerContainer } from '@/src/components/helpers/InnerContainer'
import { links } from '@/src/constants/links'

const Wrapper = styled(InnerContainer)`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColor};
  flex-direction: row;
  flex-shrink: 0;
  justify-content: center;
  margin-top: auto;
  padding-bottom: 40px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    justify-content: space-between;
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.desktopStart}) {
    padding-bottom: 65px;
  }
`

const FooterLogo = styled(Logo)`
  display: none;
  height: 37px;
  width: 108px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    display: block;
  }
`

const EndContent = styled.div`
  align-items: center;
  column-gap: 50px;
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    justify-content: space-between;
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    width: auto;
  }
`

const Links = styled.div`
  align-items: center;
  column-gap: 30px;
  display: none;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    display: flex;
  }
`

const Link = styled.a`
  color: ${({ theme: { colors } }) => colors.accent};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    opacity: 0.7;
  }
`

export const Footer: React.FC = (props) => {
  return (
    <Wrapper as="footer" {...props}>
      <FooterLogo />
      <EndContent>
        <Links>
          {links.map(({ href, text }, index) => (
            <Link href={href} key={index} target="_blank">
              {text}
            </Link>
          ))}
        </Links>
        <SocialLinks />
      </EndContent>
    </Wrapper>
  )
}

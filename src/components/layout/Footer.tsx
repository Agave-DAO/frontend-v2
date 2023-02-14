import styled from 'styled-components'

import { Discord } from '@/src/components/assets/Discord'
import { Medium } from '@/src/components/assets/Medium'
import { Telegram } from '@/src/components/assets/Telegram'
import { Twitter } from '@/src/components/assets/Twitter'
import { Logo } from '@/src/components/common/Logo'
import { InnerContainer } from '@/src/components/helpers/InnerContainer'

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

const Social = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 16px;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background: ${({ theme: { colors } }) => colors.darkBackground04};
    border-radius: 16px;
    height: 42px;
    padding: 0 16px;
  }
`

const SocialLink = styled.a`
  --size: 26px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.darkGray};
  border-radius: 4px;
  display: flex;
  height: var(--size);
  justify-content: center;
  text-decoration: none;
  transition: background-color 0.15s linear;
  width: var(--size);

  &:hover {
    background-color: #fff;

    .fill {
      fill: ${({ theme: { colors } }) => colors.darkGray};
    }
  }

  &:active {
    opacity: 0.7;
  }
`

export const Footer: React.FC = (props) => {
  const links = [
    {
      href: '#',
      title: 'Governance',
    },
    {
      href: '#',
      title: 'Forum',
    },
    {
      href: '#',
      title: 'Terms of Service',
    },
  ]
  const socialLinks = [
    {
      href: '#',
      icon: <Telegram />,
      title: 'Agave Telegram',
    },
    {
      href: '#',
      icon: <Discord />,
      title: 'Agave Discord',
    },
    {
      href: '#',
      icon: <Twitter />,
      title: 'Agave Twitter',
    },
    {
      href: '#',
      icon: <Medium />,
      title: 'Agave Medium',
    },
  ]

  return (
    <Wrapper as="footer" {...props}>
      <FooterLogo />
      <EndContent>
        <Links>
          {links.map(({ href, title }, index) => (
            <Link href={href} key={index} target="_blank">
              {title}
            </Link>
          ))}
        </Links>
        <Social>
          <span>Our community</span>
          {socialLinks.map(({ href, icon, title }, index) => (
            <SocialLink href={href} key={index} target="_blank" title={title}>
              {icon}
            </SocialLink>
          ))}
        </Social>
      </EndContent>
    </Wrapper>
  )
}

import styled from 'styled-components'

import { Discord } from '@/src/components/assets/Discord'
import { Telegram } from '@/src/components/assets/Telegram'
import { Twitter } from '@/src/components/assets/Twitter'

const Wrapper = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 16px;
  display: flex;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background: ${({ theme: { colors } }) => colors.darkBackground04};
    border-radius: 16px;
    height: 42px;
    padding: 0 16px;
    width: auto;
  }
`

const SocialTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  flex-shrink: 0;
  font-size: 1.4rem;
  line-height: 1.2;
  margin-right: auto;
  white-space: nowrap;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin: 0;
  }
`

SocialTitle.defaultProps = {
  className: 'socialTitle',
}

const SocialLink = styled.a`
  --size: 26px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.darkGray};
  border-radius: 4px;
  display: flex;
  flex-shrink: 0;
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

SocialLink.defaultProps = {
  className: 'socialLink',
}

export const SocialLinks: React.FC = (props) => {
  const socialLinks = [
    {
      href: 'https://t.me/Agave1Hive',
      icon: <Telegram />,
      title: 'Agave Telegram',
    },
    {
      href: 'https://discord.com/invite/SstXTj6xgp',
      icon: <Discord />,
      title: 'Agave Discord',
    },
    {
      href: 'https://twitter.com/Agave_lending',
      icon: <Twitter />,
      title: 'Agave Twitter',
    },
    // {
    //   href: 'https://agavefinance.medium.com/',
    //   icon: <Medium />,
    //   title: 'Agave Medium',
    // },
  ]

  return (
    <Wrapper {...props}>
      <SocialTitle>Our community</SocialTitle>
      {socialLinks.map(({ href, icon, title }, index) => (
        <SocialLink href={href} key={index} target="_blank" title={title}>
          {icon}
        </SocialLink>
      ))}
    </Wrapper>
  )
}

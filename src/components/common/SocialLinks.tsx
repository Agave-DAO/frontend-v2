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
    background: ${({ theme: { colors } }) => colors.black40};
    border-radius: 16px;
    height: 42px;
    padding: 0 16px;
    width: auto;
  }
`

const Title = styled.div`
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

Title.defaultProps = {
  className: 'socialTitle',
}

const Link = styled.a`
  --size: 26px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.black};
  border-radius: 4px;
  display: flex;
  flex-shrink: 0;
  height: var(--size);
  justify-content: center;
  text-decoration: none;
  transition: background-color 0.15s linear;
  width: var(--size);

  .fill {
    transition: fill 0.3s linear;
  }

  &:hover {
    background-color: #fff;

    .fill {
      fill: ${({ theme: { colors } }) => colors.black};
    }
  }

  &:active {
    opacity: 0.7;
  }
`

Link.defaultProps = {
  className: 'socialLink',
}

export const SocialLinks: React.FC = (props) => {
  const links = [
    {
      href: 'https://t.me/Agave1Hive',
      icon: <Telegram />,
      title: 'Agave Telegram',
    },
    {
      href: 'https://discord.gg/Bsuqe76QPm',
      icon: <Discord />,
      title: 'Agave Discord',
    },
    {
      href: 'https://twitter.com/Agave_lending',
      icon: <Twitter />,
      title: 'Agave Twitter',
    },
  ]

  return (
    <Wrapper {...props}>
      <Title>Our community</Title>
      {links.map(({ href, icon, title }, index) => (
        <Link href={href} key={index} target="_blank" title={title}>
          {icon}
        </Link>
      ))}
    </Wrapper>
  )
}

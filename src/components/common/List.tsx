import Link, { LinkProps } from 'next/link'
import styled from 'styled-components'

import { ButtonGoTo } from '@/src/components/buttons/ButtonGoTo'

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
  row-gap: 16px;
`

export const ListItem = styled.li`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.primary10};
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  min-height: 88px;
  padding: 16px;
  row-gap: 16px;

  &:active {
    opacity: 0.8;
  }
`

const ItemTitle = styled.span`
  font-weight: 700;
  font-size: 1.8rem;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.1rem;
  }
`

const ButtonGo = styled(ButtonGoTo)`
  &:active {
    opacity: 1;
  }
`

const NavLink = styled(Link)`
  text-decoration: none;
`

interface ListNavigationItemProps extends LinkProps {
  className?: string
  title: string
}

export const ListNavigationItem: React.FC<ListNavigationItemProps> = ({
  className,
  href,
  title,
}) => {
  return (
    <ListItem as={NavLink} className={className} href={href}>
      <ItemTitle>{title}</ItemTitle>
      <ButtonGo />
    </ListItem>
  )
}

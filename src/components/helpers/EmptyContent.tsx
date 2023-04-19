import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Alert } from '@/src/components/assets/Alert'
import { ActionButton } from '@/src/components/buttons/ActionButton'

export const Wrapper = styled.div`
  background-color: ${({ theme: { colors } }) => colors.primary10};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 32px 16px;
  row-gap: 16px;
`

export const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 8px;
`

export const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
`

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  link?: {
    text: string
    href: string
  }
  text: string | React.ReactNode
  title: string
}

export const EmptyContent: React.FC<Props> = ({ link, text, title, ...restProps }) => {
  const router = useRouter()

  return (
    <Wrapper {...restProps}>
      <Alert />
      <div>
        {title && <Title>{title}</Title>}
        {text && <Text>{text}</Text>}
      </div>
      {link && <ActionButton onClick={() => router.push(link.href)}>{link.text}</ActionButton>}
    </Wrapper>
  )
}

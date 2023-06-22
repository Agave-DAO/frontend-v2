import styled from 'styled-components'

import { ButtonMini } from '@/src/components/buttons/ButtonMini'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 0 32px;
  padding: 0 0 0 var(--padding-md);
  width: 100%;
`

export const Title = styled.h3`
  color: ${({ theme: { colors } }) => colors.darkestGray};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
`

type ButtonVariants = 'dark' | 'regular' | 'danger' | undefined

export interface ButtonType {
  disabled?: boolean
  onClick: () => void
  text: string
  variant?: ButtonVariants
}

export const TitleWithAction: React.FC<{
  button: ButtonType
  title: string | React.ReactNode
}> = ({ button, title, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Title>{title}</Title>
      <ButtonMini
        disabled={button.disabled}
        onClick={button.onClick}
        type="button"
        variant={button.variant}
      >
        {button.text}
      </ButtonMini>
    </Wrapper>
  )
}

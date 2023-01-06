import { DOMAttributes, HTMLAttributes } from 'react'
import styled from 'styled-components'

import { Spinner } from '@/src/components/loading/Spinner'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  line-height: 1.2;
  margin: 0;
  padding-top: 15px;
  text-align: center;
  width: 100%;
`

interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  text?: string
}

export const Loading: React.FC<Props> = ({ text = 'Loading...', ...restProps }) => (
  <Wrapper {...restProps}>
    <Spinner />
    <Text> {text}</Text>
  </Wrapper>
)

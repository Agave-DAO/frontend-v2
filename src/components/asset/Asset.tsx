import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

const Wrapper = styled.div`
  --padding-medium: 16px;
  --padding-xl: 24px;
  --border-radius: 16px;

  background-color: rgba(1, 157, 139, 0.1);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  height: 100%; // not super convinced about this...
`

export const Head = styled.div`
  background-color: rgba(1, 157, 139, 0.05);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  column-gap: 16px;
  display: flex;
  padding: var(--padding-xl) var(--padding-medium);
`

export const HeadContents = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  margin: auto 0;
`

export const Body = styled.div`
  padding: var(--padding-medium);
`

export interface TitleValueType {
  title: string
  value: BigNumber
  extraInfo?: React.ReactNode
}

export const Asset: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...restProps }) => {
  return <Wrapper {...restProps}>{children}</Wrapper>
}

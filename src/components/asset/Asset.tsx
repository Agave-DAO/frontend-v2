import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { BigNumber } from 'ethers'

const Wrapper = styled.div`
  --padding-medium: 16px;
  --padding-xl: 24px;

  background-color: rgba(1, 157, 139, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  height: 100%; // not super convinced about this...
`

export const Head = styled.div`
  background-color: rgba(1, 157, 139, 0.05);
  column-gap: 16px;
  display: flex;
  padding: var(--padding-xl) var(--padding-medium);
`

export const Icon = styled.div<{ symbol?: string }>`
  --token-icon-size: 58px;

  align-items: center;
  background-color: ${({ symbol, theme: { colors } }) => {
    const symbolLowerCase = symbol?.toLowerCase() as string

    return symbolLowerCase === 'gno'
      ? '#00193C'
      : symbolLowerCase === 'weth'
      ? '#000'
      : symbolLowerCase === 'wxdai'
      ? '#006268'
      : symbolLowerCase === 'dai'
      ? '#fbcc5f'
      : symbolLowerCase === 'xdai'
      ? '#006268'
      : symbolLowerCase === 'usdc'
      ? '#2775CA'
      : symbolLowerCase === 'wbtc'
      ? '#F09242'
      : symbolLowerCase === 'usdt'
      ? '#50AF95'
      : symbolLowerCase === 'link'
      ? '#2A5ADA'
      : symbolLowerCase === 'fox'
      ? '#131D27'
      : colors.primary
  }};
  border-radius: 16px;
  display: flex;
  flex-shrink: 0;
  height: var(--token-icon-size);
  justify-content: center;
  transition: background-color 0.25s linear;
  width: var(--token-icon-size);
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

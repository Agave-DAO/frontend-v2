import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

export const getIconBackgroundColor = (symbol?: string): string => {
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
    : symbolLowerCase === 'agve'
    ? '#fff'
    : symbolLowerCase === 'eure'
    ? '#027fba'
    : symbolLowerCase === 'wsteth'
    ? '#f5f5f5'
    : '#019D8B'
}

const Wrapper = styled.div<{ dimensions: string; symbol: string }>`
  align-items: center;
  background-color: ${({ symbol }) => getIconBackgroundColor(symbol)};
  border-radius: 50%;
  display: flex;
  height: ${({ dimensions }) => dimensions}px;
  justify-content: center;
  width: ${({ dimensions }) => dimensions}px;
`

const Placeholder = styled.div`
  color: #fff;
  font-size: 80%;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
`

interface Props {
  dimensions?: number
  symbol: string
}

export const TokenIcon: React.FC<Props> = ({ dimensions = 18, symbol, ...restProps }) => {
  const tokens = useAgaveTokens().allTokens
  const [error, setError] = useState(false)
  const tokenImage = tokens.find(
    (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
  )?.logoURI

  return (
    <Wrapper dimensions={`${dimensions}`} symbol={symbol} title={symbol} {...restProps}>
      {tokenImage && !error ? (
        <Image
          alt={symbol}
          className="tokenIcon"
          height={dimensions - 8}
          onError={() => setError(true)}
          src={tokenImage}
          width={dimensions - 8}
        />
      ) : (
        <Placeholder>{symbol[0]}</Placeholder>
      )}
    </Wrapper>
  )
}

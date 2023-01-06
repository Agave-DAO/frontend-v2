import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

import { useTokenIcons } from '@/src/providers/tokenIconsProvider'

const Placeholder = styled.div<{ dimensions: string }>`
  align-items: center;
  background-color: #cacaca;
  border-radius: 50%;
  color: #000;
  display: flex;
  font-size: 80%;
  font-weight: 700;
  height: ${({ dimensions }) => dimensions}px;
  justify-content: center;
  line-height: 1;
  text-transform: uppercase;
  width: ${({ dimensions }) => dimensions}px;
`

interface Props {
  dimensions?: number
  symbol: string
}

export const TokenIcon: React.FC<Props> = ({ dimensions = 18, symbol, ...restProps }) => {
  const { tokensBySymbol } = useTokenIcons()
  const [error, setError] = useState(false)
  const tokenImage = tokensBySymbol[symbol.toLowerCase()]?.logoURI

  return tokenImage && !error ? (
    <Image
      alt={symbol}
      className="tokenIcon"
      height={dimensions}
      onError={() => setError(true)}
      src={tokenImage}
      title={symbol}
      width={dimensions}
      {...restProps}
    />
  ) : (
    <Placeholder dimensions={`${dimensions}`}>{symbol[0]}</Placeholder>
  )
}

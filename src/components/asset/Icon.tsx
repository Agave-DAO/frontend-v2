import styled from 'styled-components'

import { getIconBackgroundColor } from '@/src/components/token/TokenIcon'
import { TokenIcon } from '@/src/components/token/TokenIcon'

export const IconWrapper = styled.div<{ symbol?: string }>`
  --token-icon-size: 58px;

  align-items: center;
  background-color: ${({ symbol }) => getIconBackgroundColor(symbol)};
  border-radius: 16px;
  display: flex;
  flex-shrink: 0;
  height: var(--token-icon-size);
  justify-content: center;
  transition: background-color 0.25s linear;
  width: var(--token-icon-size);
`

export const Icon: React.FC<{ symbol: string; dimensions?: number }> = ({
  dimensions,
  symbol,
  ...restProps
}) => {
  return (
    <IconWrapper symbol={symbol} {...restProps}>
      <TokenIcon dimensions={dimensions} symbol={symbol} />
    </IconWrapper>
  )
}

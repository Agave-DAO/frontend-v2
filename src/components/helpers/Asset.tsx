import { TokenIcon } from '@/src/components/token/TokenIcon'

export const Asset = ({ symbol }: { symbol: string }) => (
  <strong>
    <TokenIcon symbol={symbol} /> {symbol}
  </strong>
)

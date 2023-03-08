import { TokenIcon } from '@/src/components/token/TokenIcon'

export const Asset = ({ symbol }: { symbol: string }) => (
  <>
    <TokenIcon symbol={symbol} /> {symbol}
  </>
)

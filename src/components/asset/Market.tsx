import { Asset } from '@/src/components/asset/Asset'
import { MarketBody, Props as MarketBodyProps } from '@/src/components/asset/MarketBody'
import { MarketHead, Props as MarketHeadProps } from '@/src/components/asset/MarketHead'

interface Props extends MarketBodyProps, MarketHeadProps {}

export const Market: React.FC<Props> = ({
  href,
  tokenAddress,
  tokenValue,
  usdValue,
  ...restProps
}) => {
  return (
    <Asset>
      <MarketHead
        href={href}
        tokenAddress={tokenAddress}
        tokenValue={tokenValue}
        usdValue={usdValue}
      />
      <MarketBody {...restProps} />
    </Asset>
  )
}

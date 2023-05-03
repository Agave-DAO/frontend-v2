import styled from 'styled-components'

import { Head, HeadContents } from '@/src/components/asset/Asset'
import { AssetTitle } from '@/src/components/asset/AssetTitle'
import { AssetValue, Props as AssetValueProps } from '@/src/components/asset/AssetValue'
import { Icon } from '@/src/components/asset/Icon'
import { AGoTo as BaseAGoTo } from '@/src/components/buttons/ButtonGoTo'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

const AGoTo = styled(BaseAGoTo)`
  margin: auto;
`

export interface Props extends AssetValueProps {
  href: string
  tokenAddress: string
}

export const MarketHead: React.FC<Props> = ({
  href,
  tokenAddress,
  tokenValue,
  usdValue,
  ...restProps
}) => {
  const { symbol } = useAgaveTokens().getTokenByAddress(tokenAddress)

  return (
    <Head {...restProps}>
      <Icon dimensions={36} symbol={symbol} />
      <HeadContents>
        <AssetTitle>Market Size</AssetTitle>
        <AssetValue tokenValue={tokenValue} usdValue={usdValue} />
      </HeadContents>
      <AGoTo href={href} />
    </Head>
  )
}

import Link from 'next/link'
import styled from 'styled-components'

import { Head, HeadContents, Icon } from '@/src/components/asset/Asset'
import { AssetTitle } from '@/src/components/asset/AssetTitle'
import { AssetValue, Props as AssetValueProps } from '@/src/components/asset/AssetValue'
import { AGoTo as BaseAGoTo } from '@/src/components/buttons/ButtonGoTo'
import { TokenIcon } from '@/src/components/token/TokenIcon'
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
      <Icon symbol={symbol}>
        <TokenIcon dimensions={36} symbol={symbol} />
      </Icon>
      <HeadContents>
        <AssetTitle>Market Size</AssetTitle>
        <AssetValue tokenValue={tokenValue} usdValue={usdValue} />
      </HeadContents>
      <Link href={href} legacyBehavior passHref shallow>
        <AGoTo />
      </Link>
    </Head>
  )
}

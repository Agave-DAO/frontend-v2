import Link from 'next/link'
import styled from 'styled-components'

import { Head, HeadContents, Icon } from '@/src/components/asset/Asset'
import { AssetValue, Props as AssetValueProps } from '@/src/components/asset/AssetValue'
import { AGoTo as BaseAGoTo } from '@/src/components/buttons/ButtonGoTo'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'

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
  const { symbol } = agaveTokens.getTokenByAddress(tokenAddress)

  return (
    <Head {...restProps}>
      <Icon symbol={symbol}>
        <TokenIcon dimensions={36} symbol={symbol} />
      </Icon>
      <HeadContents>
        <AssetValue tokenValue={tokenValue} usdValue={usdValue} />
      </HeadContents>
      <Link href={href} legacyBehavior passHref>
        <AGoTo />
      </Link>
    </Head>
  )
}
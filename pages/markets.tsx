import { NextPage } from 'next'
import styled from 'styled-components'

import { MarketList } from '../src/pagePartials/markets/MarketList'
import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useAllReservesTokens } from '@/src/hooks/agave/useAllReservesTokens'
import { AgaveTokensDataProvider } from '@/src/providers/agaveTokensDataProvider'
import TokenIconsProvider from '@/src/providers/tokenIconsProvider'
import { Token } from '@/types/token'

const Card = styled(BaseCard)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Markets: NextPage = () => {
  // TODO allTokensQuery (hardcoded value?)
  const tokens = useAllReservesTokens()?.map(([symbol, address]: [string, string]) => ({
    symbol,
    address,
    decimals: 0,
  })) as Token[]

  return (
    <TokenIconsProvider>
      <AgaveTokensDataProvider tokens={tokens}>
        <BaseTitle>Markets</BaseTitle>
        <Card>
          <MarketList />
        </Card>
      </AgaveTokensDataProvider>
    </TokenIconsProvider>
  )
}

export default Markets

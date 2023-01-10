import { Fragment } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useAgaveTokensData } from '@/src/hooks/agave/useAgaveTokensData'
import { formatAmount } from '@/src/utils/common'
import { Token } from '@/types/token'

const Grid = styled.a`
  align-items: center;
  column-gap: 20px;
  display: flex;
  row-gap: 20px;
  > * {
    flex: 1;
    text-align: center;
  }
`

const DISABLED_MARKETS = [
  '0xe2e73a1c69ecf83f464efce6a5be353a37ca09b2',
  '0x21a42669643f45bc0e086b8fc2ed70c23d67509d',
]

export const MarketList = withGenericSuspense(
  ({ tokens }: { tokens: Token[] }) => {
    const { agaveTokensData, market } = useAgaveTokensData(tokens)

    if (!agaveTokensData) return <Loading />

    const dataWithoutDisabledMarket = Object.fromEntries(
      Object.entries(agaveTokensData).filter(
        ([tokenAddress]) => !DISABLED_MARKETS.includes(tokenAddress),
      ),
    )

    return (
      <>
        TOTAL MARKET SIZE: {formatAmount(market.totalMarketSize)}
        <Grid>
          <strong>Asset</strong>
          <strong>Price</strong>
          <strong>Market size</strong>
          <strong>Total borrowed</strong>
          <strong>Deposit APY</strong>
          <strong>Variable borrow APR</strong>
          <strong>Stable borrow APR</strong>
        </Grid>
        <hr />
        {tokens.map(({ address, symbol }) => {
          const { price: marketPrice } = agaveTokensData[address]
          const marketSize = market.marketSizes[address]

          // if (DISABLED_MARKETS.includes(address)) return null

          return (
            <Fragment key={address}>
              <Grid>
                <strong>
                  <TokenIcon symbol={symbol} /> {symbol}
                </strong>
                <p>{formatAmount(marketPrice)}</p>
                <p>{formatAmount(marketSize)}</p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
              </Grid>
              <hr />
            </Fragment>
          )
        })}
      </>
    )
  },
  () => <Loading text="Fetching markets..." />,
)

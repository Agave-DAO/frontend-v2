import { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useAgaveTokensData } from '@/src/hooks/agave/useAgaveTokensData'
import { formatAmount } from '@/src/utils/common'
import { getMarketSize } from '@/src/utils/markets'
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

export const MarketList = withGenericSuspense(
  ({ tokens }: { tokens: Token[] }) => {
    const { agaveTokensData } = useAgaveTokensData(tokens)

    if (!agaveTokensData) return <Loading />

    const markets = Object.values(agaveTokensData)

    /* Calculating the total market size. */
    const totalMarketSize = useMemo(
      () =>
        markets.reduce((totalMarketSize, current) => {
          const currentMarketSize = getMarketSize({
            tokenAddress: current.tokenInfo.address,
            agTokenTotalSupply: current.agTokenTotalSupply,
            price: current.price,
          })
          return totalMarketSize.add(currentMarketSize)
        }, ZERO_BN),
      [markets],
    )

    return (
      <>
        TOTAL MARKET SIZE: {formatAmount(totalMarketSize)}
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
        {markets.map(({ agTokenTotalSupply, price, tokenInfo }) => {
          const currentMarketSize = getMarketSize({
            tokenAddress: tokenInfo.address,
            agTokenTotalSupply: agTokenTotalSupply,
            price: price,
          })
          return (
            <Fragment key={tokenInfo.address}>
              <Grid>
                <strong>
                  <TokenIcon symbol={tokenInfo.symbol} /> {tokenInfo.symbol}
                </strong>
                <p>{formatAmount(price)}</p>
                <p>{formatAmount(currentMarketSize)}</p>
                <p></p>
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

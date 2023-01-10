import { Fragment } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { Loading } from '@/src/components/loading/Loading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useAgaveTokensData } from '@/src/hooks/agave/useAgaveTokensData'
import { renderAsPrice } from '@/src/utils/common'
import { Token } from '@/types/token'

const Grid = styled(SimpleGrid)`
  > * {
    flex: 1;
    text-align: center;
  }
`

export const MarketList = withGenericSuspense(
  ({ tokens }: { tokens: Token[] }) => {
    const { agaveTokensData } = useAgaveTokensData(tokens)

    if (!agaveTokensData) return <Loading />

    return (
      <>
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
        {Object.values(agaveTokensData).map(({ priceInDai, tokenInfo }) => (
          <Fragment key={tokenInfo.address}>
            <Grid>
              <strong>
                <TokenIcon symbol={tokenInfo.symbol} /> {tokenInfo.symbol}
              </strong>
              <p>{renderAsPrice({ decimals: 18, value: priceInDai })}</p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </Grid>
            <hr />
          </Fragment>
        ))}
      </>
    )
  },
  () => <Loading text="Fetching markets..." />,
)

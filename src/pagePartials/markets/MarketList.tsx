import { Fragment } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useAgaveTokensDataContext } from '@/src/providers/agaveTokensDataProvider'
import { renderAsPrice } from '@/src/utils/common'

const Grid = styled(SimpleGrid)`
  > * {
    flex: 1;
    text-align: center;
  }
`

export const MarketList = withGenericSuspense(() => {
  const tokensFromContext = useAgaveTokensDataContext()

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
      {Object.values(tokensFromContext).map(({ priceInDai, reserveData, tokenInfo }) => (
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
})

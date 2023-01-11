import { Fragment } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
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
    const { agaveTokensData, getTokenMarketSize, getTokenTotalBorrowed, getTotalMarketSize } =
      useAgaveTokensData(tokens)

    if (!agaveTokensData) return <Loading />

    return (
      <>
        TOTAL MARKET SIZE: {formatAmount(getTotalMarketSize())}
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
        {Object.values(agaveTokensData).map(({ price, tokenAddress }) => {
          const { decimals, symbol } = agaveTokens.getUnderlyingTokenInfoByAddress(tokenAddress)
          return (
            <Fragment key={tokenAddress}>
              <Grid>
                <strong>
                  <TokenIcon symbol={symbol} /> {symbol}
                </strong>
                <p>{formatAmount(price)}</p>
                <p>{formatAmount(getTokenMarketSize(tokenAddress))}</p>
                <div>
                  <p>{formatAmount(getTokenTotalBorrowed(tokenAddress, decimals).dai)}</p>
                  <p>
                    {formatAmount(
                      getTokenTotalBorrowed(tokenAddress, decimals).wei,
                      decimals,
                      '',
                      'after',
                    )}
                  </p>
                </div>
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

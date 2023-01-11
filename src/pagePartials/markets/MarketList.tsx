import { Fragment } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useAgaveTokensData } from '@/src/hooks/agave/useAgaveTokensData'
import { formatAmount, formatPercentage } from '@/src/utils/common'
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
    const {
      agaveTokensData,
      getBorrowRate,
      getDepositAPY,
      getTokenMarketSize,
      getTokenTotalBorrowed,
      getTotalMarketSize,
    } = useAgaveTokensData(tokens)

    if (!agaveTokensData) return <Loading />

    return (
      <>
        <h3>TOTAL MARKET SIZE: {formatAmount(getTotalMarketSize())}</h3>
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
                {/* TODO: missing include incentive rates here */}
                {/* TODO: Move 25/27 to a constant */}
                <p>{formatPercentage(getDepositAPY(tokenAddress), 25)}</p>
                <p>{formatPercentage(getBorrowRate(tokenAddress).variable, 27)}</p>
                <p>{formatPercentage(getBorrowRate(tokenAddress).stable, 27)}</p>
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

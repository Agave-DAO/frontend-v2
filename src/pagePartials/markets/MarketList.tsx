import { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import { Amount } from '@/src/components/helpers/Amount'
import { Asset } from '@/src/components/helpers/Asset'
import { Percentage } from '@/src/components/helpers/Percentage'
import { Rates } from '@/src/components/helpers/Rates'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useAgaveMarketsData } from '@/src/hooks/agave/useAgaveMarketsData'
import { formatAmount, fromWei } from '@/src/utils/common'

export const Grid = styled.div`
  align-items: center;
  column-gap: 20px;
  display: flex;
  row-gap: 20px;
  > * {
    flex: 1;
    text-align: center;
  }
`

export const CustomP = styled.p`
  margin: 0;
  line-height: 1.8;
`

export const CustomHR = styled.hr`
  margin: 15px 0;
`

export const MarketList = withGenericSuspense(
  () => {
    const {
      agaveMarketsData,
      getBorrowRate,
      getDepositAPY,
      getIncentiveRate,
      getMarketSize,
      getTotalBorrowed,
    } = useAgaveMarketsData()

    if (!agaveMarketsData) {
      return <CustomP>Unable to get markets</CustomP>
    }

    /* Filtering out the frozen markets. */
    const noFrozenMarkets = agaveMarketsData.filter(({ assetData: { isFrozen } }) => !isFrozen)

    /* Calculating the total market size of all markets. */
    const totalMarketSize = useMemo(
      () =>
        noFrozenMarkets.reduce(
          (currentTotal, { tokenAddress }) => currentTotal.add(getMarketSize(tokenAddress)),
          ZERO_BN,
        ),
      [getMarketSize, noFrozenMarkets],
    )

    return (
      <>
        <h3>TOTAL MARKET SIZE: {formatAmount(totalMarketSize)}</h3>
        <Grid>
          <strong>Asset</strong>
          <strong>Price</strong>
          <strong>Market size</strong>
          <strong>Total borrowed</strong>
          <strong>Deposit APY</strong>
          <strong>Variable borrow APR</strong>
          <strong>Stable borrow APR</strong>
        </Grid>
        <CustomHR />
        {noFrozenMarkets.map(({ priceData, tokenAddress }) => {
          const { decimals, symbol } = agaveTokens.getTokenByAddress(tokenAddress)

          return (
            <Fragment key={tokenAddress}>
              <Grid>
                <Asset symbol={symbol} />
                <Amount value={priceData} />
                <Amount value={getMarketSize(tokenAddress)} />
                <div>
                  <Amount
                    value={fromWei(getTotalBorrowed(tokenAddress).mul(priceData), decimals)}
                  />
                  <br />
                  <Amount
                    decimals={decimals}
                    symbol={symbol}
                    symbolPosition="after"
                    value={getTotalBorrowed(tokenAddress)}
                  />
                </div>
                {/* TODO: Move 25 to a constant ? */}
                <Rates
                  base={getDepositAPY(tokenAddress)}
                  incentive={getIncentiveRate(tokenAddress, 'ag')}
                  total={getDepositAPY(tokenAddress).add(getIncentiveRate(tokenAddress, 'ag'))}
                />
                <Rates
                  base={getBorrowRate(tokenAddress).variable}
                  incentive={getIncentiveRate(tokenAddress, 'variableDebt')}
                  total={getBorrowRate(tokenAddress).variable.sub(
                    getIncentiveRate(tokenAddress, 'variableDebt'),
                  )}
                />
                <Percentage decimals={25} value={getBorrowRate(tokenAddress).stable} />
              </Grid>
              <CustomHR />
            </Fragment>
          )
        })}
      </>
    )
  },
  () => <Loading text="Fetching markets..." />,
)

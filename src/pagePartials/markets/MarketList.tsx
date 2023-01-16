import { Fragment } from 'react'
import styled from 'styled-components'

import { BigNumber } from 'ethers'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useAgaveTokensData } from '@/src/hooks/agave/useAgaveTokensData'
import { SymbolPosition, formatAmount, formatPercentage, weiPerToken } from '@/src/utils/common'
import { Token } from '@/types/token'

const Grid = styled.div`
  align-items: center;
  column-gap: 20px;
  display: flex;
  row-gap: 20px;
  > * {
    flex: 1;
    text-align: center;
  }
`

const CustomP = styled.p`
  margin: 0;
  line-height: 1.8;
`

const CustomHR = styled.hr`
  margin: 15px 0;
`

const Asset = ({ symbol }: { symbol: string }) => (
  <strong>
    <TokenIcon symbol={symbol} /> {symbol}
  </strong>
)

const Amount = ({
  decimals,
  symbol,
  symbolPosition,
  value,
}: {
  value: BigNumber
  decimals?: number
  symbol?: string
  symbolPosition?: SymbolPosition
}) => <CustomP>{formatAmount(value, decimals, symbol, symbolPosition)}</CustomP>

const Percentage = ({ decimals, value }: { value: BigNumber; decimals: number }) => (
  <CustomP>{formatPercentage(value, decimals)}</CustomP>
)

const Rates = ({
  base,
  incentive,
  total,
}: {
  base: BigNumber
  incentive: BigNumber
  total: BigNumber
}) => (
  <div>
    <Grid>
      Total rate: <Percentage decimals={25} value={total} />
    </Grid>
    <CustomHR />
    <Grid>
      Base rate: <Percentage decimals={25} value={base} />
    </Grid>
    <Grid>
      Incentive rate: <Percentage decimals={25} value={incentive} />
    </Grid>
  </div>
)

export const MarketList = withGenericSuspense(
  ({ tokens }: { tokens: Token[] }) => {
    const {
      agaveTokensData,
      getBorrowRate,
      getDepositAPY,
      getIncentiveRate,
      getTokenMarketSize,
      getTokenTotalBorrowed,
      getTotalMarketSize,
    } = useAgaveTokensData(tokens, false)

    if (!agaveTokensData) {
      return <CustomP>Unable to get markets</CustomP>
    }

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
        <CustomHR />
        {Object.values(agaveTokensData).map((tokenData) => {
          const { priceData, tokenAddress } = tokenData
          const { decimals, symbol } = agaveTokens.getUnderlyingTokenInfoByAddress(tokenAddress)

          return (
            <Fragment key={tokenAddress}>
              <Grid>
                <Asset symbol={symbol} />
                <Amount value={priceData} />
                <Amount value={getTokenMarketSize(tokenAddress)} />
                <div>
                  <Amount
                    value={getTokenTotalBorrowed(tokenAddress)
                      .mul(priceData)
                      .div(weiPerToken(decimals))}
                  />
                  <Amount
                    decimals={decimals}
                    symbol={symbol}
                    symbolPosition="after"
                    value={getTokenTotalBorrowed(tokenAddress)}
                  />
                </div>
                {/* TODO: Move 25 to a constant ? */}
                <Rates
                  base={getDepositAPY(tokenAddress)}
                  incentive={getIncentiveRate(tokenAddress, true)}
                  total={getDepositAPY(tokenAddress).add(getIncentiveRate(tokenAddress, true))}
                />
                <Rates
                  base={getBorrowRate(tokenAddress).variable}
                  incentive={getIncentiveRate(tokenAddress, false)}
                  total={getBorrowRate(tokenAddress).variable.sub(
                    getIncentiveRate(tokenAddress, false),
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

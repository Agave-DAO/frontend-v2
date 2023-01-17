import { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import { BigNumber } from 'ethers'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useAgaveTokensData } from '@/src/hooks/agave/useAgaveTokensData'
import { SymbolPosition, formatAmount, formatPercentage, weiPerToken } from '@/src/utils/common'
import { getMarketSize } from '@/src/utils/markets'
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
  ({ reserveTokensAddresses }: { reserveTokensAddresses: string[] }) => {
    const {
      agaveTokensData,
      getBorrowRate,
      getDepositAPY,
      getIncentiveRate,
      getTokenMarketSize,
      getTokenTotalBorrowed,
    } = useAgaveTokensData(reserveTokensAddresses)

    if (!agaveTokensData) {
      return <CustomP>Unable to get markets</CustomP>
    }

    /* Calculating the total market size. */
    const totalMarketSize = useMemo(
      () =>
        agaveTokensData.reduce((currentTotal, { assetData: { isFrozen }, tokenAddress }) => {
          if (isFrozen) {
            return currentTotal
          }
          return currentTotal.add(getTokenMarketSize(tokenAddress))
        }, ZERO_BN),
      [agaveTokensData, getTokenMarketSize],
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
        {agaveTokensData.map(({ assetData: { isFrozen }, priceData, tokenAddress }) => {
          /* Skipping the frozen tokens. */
          if (isFrozen) {
            return
          }

          const { decimals, symbol } = agaveTokens.getTokenByAddress(tokenAddress)

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

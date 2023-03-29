import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Market } from '@/src/components/asset/Market'
import { Magnifier as SVG } from '@/src/components/assets/Magnifier'
import { Textfield } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { formatAmount, fromWei } from '@/src/utils/common'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const WelcomeText = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  margin: 0 0 40px;
  order: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background: rgba(13, 32, 38, 0.1);
    border-radius: 80px;
    margin: 0 auto 56px;
    max-width: 100%;
    opacity: 0.6;
    order: 1;
    padding: 8px 24px;
    width: fit-content;
  }
`

const SearchWrapper = styled.div`
  order: 1;
  margin: 0 auto 32px;
  position: relative;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 16px;
    max-width: 734px;
    order: 0;
  }
`

const SearchField = styled(Textfield)`
  padding-right: 45px;
  position: relative;
  width: 100%;
  z-index: 1;
`

const Magnifier = styled(SVG)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
`

const MarketSize = styled.div`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.mainDark440};
  border-radius: 16px;
  border: 1px solid ${({ theme: { colors } }) => colors.darkGreen50};
  display: flex;
  height: 50px;
  justify-content: space-between;
  margin-bottom: 16px;
  order: 2;
  padding: 0 16px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    border-radius: 60px;
    column-gap: 16px;
    height: 53px;
    margin: 0 auto 24px;
    padding: 0 32px;
    width: fit-content;
  }
`

const MarketSizeLabel = styled.span`
  color: ${({ theme: { colors } }) => colors.white60};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

const MarketSizeValue = styled.span`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.1rem;
  }
`

export const MarketList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { agaveMarketsData, getBorrowRate, getDepositAPY, getIncentiveRate, getMarketSize } =
      useMarketsData()
    const [search, setSearch] = useState('')
    const markets = agaveMarketsData
      ? agaveMarketsData.filter(({ assetData: { isFrozen } }) => !isFrozen)
      : undefined
    const totalMarketSize = useMemo(
      () =>
        markets
          ? markets.reduce(
              (currentTotal, { tokenAddress }) => currentTotal.add(getMarketSize(tokenAddress).usd),
              ZERO_BN,
            )
          : undefined,
      [getMarketSize, markets],
    )

    return markets ? (
      <Wrapper {...restProps}>
        <WelcomeText>Move cryptocurrency from your wallet and start earning interest.</WelcomeText>
        <SearchWrapper>
          <SearchField
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset"
            type="search"
          />
          <Magnifier />
        </SearchWrapper>
        {totalMarketSize && (
          <MarketSize>
            <MarketSizeLabel>Current Market size</MarketSizeLabel>
            <MarketSizeValue>{formatAmount(totalMarketSize)}</MarketSizeValue>
          </MarketSize>
        )}
        <AssetsList>
          {markets
            // pretty shitty search filter (improve when possible)
            .filter(({ tokenAddress }) => {
              const { symbol } = agaveTokens.getTokenByAddress(tokenAddress)
              return symbol.toUpperCase().indexOf(search.toUpperCase()) >= 0
            })
            .map(({ priceData, tokenAddress }, index) => {
              const { decimals, symbol } = agaveTokens.getTokenByAddress(tokenAddress)
              const data = {
                borrowBaseRate: {
                  title: 'Base rate',
                  value: getBorrowRate(tokenAddress).variable,
                },
                borrowIncentivesRate: {
                  title: 'Incentives rate',
                  value: getIncentiveRate(tokenAddress, 'variableDebt'),
                },
                borrowStableAPR: {
                  title: 'Stable borrow APR',
                  value: getBorrowRate(tokenAddress).stable,
                },
                borrowVariableAPR: {
                  title: 'Variable borrow APR',
                  value: getBorrowRate(tokenAddress).variable.sub(
                    getIncentiveRate(tokenAddress, 'variableDebt'),
                  ),
                },
                depositAPY: {
                  title: 'Deposit APY',
                  value: getDepositAPY(tokenAddress).add(getIncentiveRate(tokenAddress, 'ag')),
                },
                depositBaseRate: { title: 'Base rate', value: getDepositAPY(tokenAddress) },
                depositIncentivesRate: {
                  title: 'Incentives rate',
                  value: getIncentiveRate(tokenAddress, 'ag'),
                },
              }

              return (
                <Market
                  href={`/markets/${symbol}`}
                  key={`market_${tokenAddress}`}
                  tokenAddress={tokenAddress}
                  tokenValue={
                    <Amount
                      decimals={decimals}
                      symbol={symbol}
                      symbolPosition="after"
                      value={getMarketSize(tokenAddress).wei}
                    />
                  }
                  usdValue={<Amount value={getMarketSize(tokenAddress).usd} />}
                  {...data}
                />
              )
            })}
        </AssetsList>
      </Wrapper>
    ) : (
      <>There was an error retrieving data...</>
    )
  },
  () => <Loading text="Fetching markets..." />,
)

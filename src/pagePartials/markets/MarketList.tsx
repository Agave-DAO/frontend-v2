import { useState } from 'react'
import styled from 'styled-components'

import { Market } from '@/src/components/asset/Market'
import { Magnifier as SVG } from '@/src/components/assets/Magnifier'
import { Textfield } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { fromWei } from '@/src/utils/common'

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
  margin: 0 auto 16px;
  position: relative;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
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

const Assets = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
  margin: 0 auto;
  max-width: 952px;
  order: 2;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    gap: 24px;
    grid-template-columns: 1fr 1fr;
  }
`

export const MarketList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { agaveMarketsData, getBorrowRate, getDepositAPY, getIncentiveRate, getTotalBorrowed } =
      useMarketsData()
    const [search, setSearch] = useState('')

    return agaveMarketsData ? (
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
        <Assets>
          {agaveMarketsData
            // no frozen markets
            .filter(({ assetData: { isFrozen } }) => !isFrozen)
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
                  key={`market_${index}`}
                  tokenAddress={tokenAddress}
                  tokenValue={
                    <Amount
                      decimals={decimals}
                      symbol={symbol}
                      symbolPosition="after"
                      value={getTotalBorrowed(tokenAddress)}
                    />
                  }
                  usdValue={
                    <Amount
                      value={fromWei(getTotalBorrowed(tokenAddress).mul(priceData), decimals)}
                    />
                  }
                  {...data}
                />
              )
            })}
        </Assets>
      </Wrapper>
    ) : (
      <>There was an error retrieveing data...</>
    )
  },
  () => <Loading text="Fetching markets..." />,
)

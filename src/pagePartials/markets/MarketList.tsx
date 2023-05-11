import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Market } from '@/src/components/asset/Market'
import { Magnifier as BaseMagnifier } from '@/src/components/assets/Magnifier'
import { NoResults } from '@/src/components/assets/NoResults'
import { GenericError } from '@/src/components/common/GenericError'
import { Textfield } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { AssetsList as BaseAssetList } from '@/src/components/layout/AssetsList'
import { MarketSkeletonLoading, SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { formatAmount } from '@/src/utils/common'

const Wrapper = styled.div`
  --list-presentation-order: 2;

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

const Magnifier = styled(BaseMagnifier)`
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

const AssetsList = styled(BaseAssetList)`
  order: var(--list-presentation-order);
`

const Error = styled(GenericError)`
  margin: 32px auto;
  order: var(--list-presentation-order);
`

export const MarketList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { agaveMarketsData, getBorrowRate, getDepositAPY, getIncentiveRate, getMarketSize } =
      useMarketsData()
    const [search, setSearch] = useState('')
    const agaveTokens = useAgaveTokens()
    const workingMarkets = useMemo(
      () => agaveMarketsData?.filter(({ assetData: { isFrozen } }) => !isFrozen),
      [agaveMarketsData],
    )
    // pretty shitty search filter (improve when possible)
    const filteredMarkets = useMemo(
      () =>
        workingMarkets?.filter(({ tokenAddress }) => {
          const { symbol } = agaveTokens.getTokenByAddress(tokenAddress)
          return symbol.toUpperCase().indexOf(search.toUpperCase()) >= 0
        }),
      [agaveTokens, search, workingMarkets],
    )
    const totalMarketSize = useMemo(
      () =>
        workingMarkets
          ? workingMarkets.reduce(
              (currentTotal, { tokenAddress }) => currentTotal.add(getMarketSize(tokenAddress).usd),
              ZERO_BN,
            )
          : undefined,
      [getMarketSize, workingMarkets],
    )

    return workingMarkets ? (
      <Wrapper {...restProps}>
        <WelcomeText>Deposit a supported token and start earning interest.</WelcomeText>
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
        {filteredMarkets?.length ? (
          <AssetsList>
            {filteredMarkets.map(({ tokenAddress }) => {
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
                  href={`/markets/${symbol}#main`}
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
        ) : (
          <Error
            icon={<NoResults />}
            text={
              <>
                No assets found related to your search.
                <br />
                Try again with a different asset name, symbol, or address.
              </>
            }
            title={`No search results for '${search}'`}
          />
        )}
      </Wrapper>
    ) : (
      <Error text="There was an error retrieving data..." />
    )
  },
  ({ ...restProps }) => (
    <Wrapper {...restProps}>
      <WelcomeText>Deposit a supported token and start earning interest.</WelcomeText>
      <SearchWrapper>
        <SearchField disabled placeholder="Search asset" type="search" />
        <Magnifier />
      </SearchWrapper>
      <SkeletonLoading
        style={{
          height: '53px',
          borderRadius: '60px',
          order: 2,
          margin: '0 auto 24px',
          width: '294px',
        }}
      />
      <AssetsList>
        {Array.from({ length: 6 }).map((item, index) => (
          <MarketSkeletonLoading key={`market_${index}`} />
        ))}
      </AssetsList>
    </Wrapper>
  ),
)

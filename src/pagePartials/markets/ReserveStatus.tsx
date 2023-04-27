import { createRef, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { InnerCard } from '@/src/components/common/InnerCard'
import { Rows as BaseRows, Row, RowKey, RowValue } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { InnerTitle } from '@/src/components/text/InnerTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useMarketDetails } from '@/src/hooks/presentation/useMarketDetails'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

const ChartWrapper = styled.div`
  position: relative;
`

const ChartWithIcon = styled.div<{ baseChartSize: number }>`
  --chart-size: ${({ baseChartSize }) => baseChartSize}px;

  height: var(--chart-size);
  margin: 0 auto 24px;
  position: relative;
  width: var(--chart-size);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --chart-size: 214px;

    margin-bottom: 0;
  }
`

const Icon = styled(TokenIcon)`
  --icon-size: 40px;
  --image-size: calc(var(--icon-size) - 15px);

  height: var(--icon-size);
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--icon-size);

  .tokenIcon {
    height: var(--image-size);
    width: var(--image-size);
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --icon-size: 77px;
    --image-size: calc(var(--icon-size) - 30px);
  }
`

const Legends = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
`

const LegendColor = styled.div<{ color: string }>`
  --legend-color-size: 16px;

  background-color: ${({ color }) => color};
  border-radius: 50%;
  height: var(--legend-color-size);
  margin-bottom: 8px;
  width: var(--legend-color-size);
`

const LegendWrapper = styled.div`
  &:nth-child(2) {
    ${LegendColor} {
      margin-left: auto;

      @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
        margin: 0;
        order: 2;
      }
    }
  }
`

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    column-gap: 8px;
    flex-direction: row;
    margin-bottom: 24px;
  }
`

const LegendLabel = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.6rem;
  }
`

const USDAmount = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.8rem;
  }
`

const TokenAmount = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.6rem;
  }
`

type Value = {
  price: BigNumber
  wei: BigNumber
}

type ChartValues = {
  numberValue: number
  rawValue: Value
  title: string
}

const Chart: React.FC<{
  availableLiquidity: Value
  decimals: number
  tokenSymbol: string
  totalBorrowed: Value
}> = ({ availableLiquidity, decimals, tokenSymbol, totalBorrowed }) => {
  const toNumber = useCallback(
    (value: BigNumber) => FixedNumber.fromValue(value, decimals).toUnsafeFloat(),
    [decimals],
  )

  const data: ChartValues[] = [
    {
      numberValue: toNumber(availableLiquidity.wei),
      rawValue: availableLiquidity,
      title: 'Available Liquidity',
    },
    {
      numberValue: toNumber(totalBorrowed.wei),
      rawValue: totalBorrowed,
      title: 'Total Borrowed',
    },
  ]
  const chartColors = ['#BCF298', '#40B3B3']
  const baseChartSize = 98
  const baseOuterRadius = baseChartSize / 2
  const node = createRef<HTMLDivElement>()
  const [outerRadius, setOuterRadius] = useState(baseOuterRadius)
  const innerRadius = useMemo(
    () => (outerRadius <= 49 ? outerRadius - 22 : outerRadius - 50),
    [outerRadius],
  )

  useEffect(() => {
    const handleResize = () => {
      if (node) {
        const { current } = node as any

        if (current) {
          const { clientWidth } = current
          setOuterRadius(clientWidth / 2)
        }
      }
    }

    window.addEventListener('resize', handleResize)

    handleResize()
  }, [node])

  return (
    <ChartWrapper>
      <ChartWithIcon baseChartSize={baseChartSize} ref={node}>
        <ResponsiveContainer>
          <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            <Pie
              data={data}
              dataKey="numberValue"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell fill={chartColors[index % chartColors.length]} key={`cell-${index}`} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Icon dimensions={77} symbol={tokenSymbol} />
      </ChartWithIcon>
      <Legends>
        {data.map(({ title }, index) => (
          <LegendWrapper key={index}>
            <Legend>
              <LegendColor color={chartColors[index % chartColors.length]} />
              <LegendLabel>{title}</LegendLabel>
            </Legend>
            <USDAmount>
              <Amount decimals={18} value={data[index].rawValue.price} />
            </USDAmount>
            <TokenAmount>
              <TokenIcon dimensions={18} symbol={tokenSymbol} />
              <Amount decimals={decimals} symbol="" value={data[index].rawValue.wei} />
            </TokenAmount>
          </LegendWrapper>
        ))}
      </Legends>
    </ChartWrapper>
  )
}

const Wrapper = styled(InnerCard)`
  padding-top: 24px;
`

const Title = styled(InnerTitle)`
  margin-bottom: 32px;
`

const Rows = styled(BaseRows)`
  margin-top: 32px;
`

export const ReserveStatus: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
  ...restProps
}) => {
  const { decimals, symbol } = useAgaveTokens().getTokenByAddress(tokenAddress)
  const { borrowed, liquidity, reserveSize, utilizationRate } = useMarketDetails(tokenAddress)

  return (
    <Wrapper {...restProps}>
      <Title>Reserve Status</Title>
      <Chart
        availableLiquidity={liquidity}
        decimals={decimals}
        tokenSymbol={symbol}
        totalBorrowed={borrowed}
      />
      <Rows>
        <Row variant="light">
          <RowKey>Reserve Size</RowKey>
          <RowValue>
            <Amount value={reserveSize.price} />
          </RowValue>
        </Row>
        <Row variant="light">
          <RowKey>Utilization Rate</RowKey>
          <RowValue>{utilizationRate}%</RowValue>
        </Row>
      </Rows>
    </Wrapper>
  )
}

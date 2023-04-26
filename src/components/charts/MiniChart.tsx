import styled from 'styled-components'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { chartColors } from '@/src/constants/common'

const Wrapper = styled.div<{ baseChartSize: number }>`
  --chart-size: ${({ baseChartSize }) => baseChartSize}px;

  height: var(--chart-size);
  width: var(--chart-size);
`

export const MiniChart: React.FC<{
  data: Array<{ value: number }>
}> = ({ data, ...restProps }) => {
  const baseChartSize = 50
  const outerRadius = baseChartSize / 2
  const innerRadius = outerRadius - 12

  return (
    <Wrapper baseChartSize={baseChartSize} {...restProps}>
      <ResponsiveContainer>
        <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <Pie
            data={data}
            dataKey="value"
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
    </Wrapper>
  )
}

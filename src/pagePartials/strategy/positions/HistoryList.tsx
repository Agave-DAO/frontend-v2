import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { Position } from '@/src/pagePartials/strategy/positions/Position'

const Wrapper = styled.div``

export const HistoryList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const mockedData = [
      {
        positionTokens: {
          type: 'long',
          status: 'closed',
          tokens: [
            { symbol: 'usdc', value: '14,000.00' },
            { symbol: 'xdai', value: '9,146,465.00' },
          ],
        },
        value: '<0.000001 WXDAI',
      },
      {
        positionTokens: {
          type: 'collateralSwap',
          status: 'closed',
          tokens: [
            { symbol: 'usdc', value: '4,000.00' },
            { symbol: 'xdai', value: '19,146,465.00' },
          ],
        },
        value: '1 USDC = 10.000034 XDAI',
      },

      {
        positionTokens: {
          type: 'short',
          status: 'closed',
          tokens: [
            { symbol: 'usdc', value: '14,000.00' },
            { symbol: 'xdai', value: '9,146,465.00' },
          ],
        },
        value: '<0.000001 WXDAI',
      },
    ]

    return (
      <Wrapper {...restProps}>
        <AssetsList maxWidth="none">
          {mockedData.map((item, index) => (
            <Position data={item} key={index} />
          ))}
        </AssetsList>
      </Wrapper>
    )
  },
  ({ ...restProps }) => <div {...restProps}>Positions History List Loading...</div>,
)

import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { Position } from '@/src/pagePartials/strategy/positions/Position'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Wrapper = styled.div``

const Button = styled(ActionButton)`
  margin-left: auto;
`

export const PositionsList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const mockedData = [
      {
        positionTokens: {
          type: 'collateralSwap',
          status: 'open',
          tokens: [
            { symbol: 'usdc', value: '4,000.00' },
            { symbol: 'xdai', value: '19,146,465.00' },
          ],
        },
        value: '1 USDC = 10.000034 XDAI',
      },
      {
        positionTokens: {
          type: 'long',
          status: 'open',
          tokens: [
            { symbol: 'usdc', value: '14,000.00' },
            { symbol: 'xdai', value: '9,146,465.00' },
          ],
        },
        value: '<0.000001 WXDAI',
      },
      {
        positionTokens: {
          type: 'short',
          status: 'open',
          tokens: [
            { symbol: 'usdc', value: '14,000.00' },
            { symbol: 'xdai', value: '9,146,465.00' },
          ],
        },
        value: '<0.000001 WXDAI',
      },
    ]
    const { openClosePositionModal } = useVaultModalContext()

    return (
      <Wrapper {...restProps}>
        <AssetsList maxWidth="none">
          {mockedData.map((item, index) => (
            <Position data={item} key={index}>
              <ActionsWrapper>
                <Button onClick={openClosePositionModal}>Close position</Button>
              </ActionsWrapper>
            </Position>
          ))}
        </AssetsList>
      </Wrapper>
    )
  },
  ({ ...restProps }) => <div {...restProps}>PositionsList Loading...</div>,
)

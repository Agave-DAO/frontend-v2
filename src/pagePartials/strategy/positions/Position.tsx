import styled from 'styled-components'

import { Asset, Body } from '@/src/components/asset/Asset'
import { PositionHead } from '@/src/components/asset/PositionHead'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'

const Wrapper = styled(Asset)`
  height: auto;
`

const Button = styled(ActionButton)`
  margin-left: auto;
`

export const Position: React.FC = ({ ...restProps }) => {
  const positionTokens = {
    type: 'collateralSwap',
    status: 'open',
    tokens: [
      { symbol: 'usdc', value: '4,000.00' },
      { symbol: 'xdai', value: '19,146,465.00' },
    ],
  }
  const limitPriceValue = '<0.000001 WXDAI'
  const swapValue = '1 USDC = 10.000034 XDAI'

  return (
    <Wrapper {...restProps}>
      <PositionHead
        limitPriceValue={limitPriceValue}
        positionTokens={positionTokens}
        swapValue={swapValue}
      />
      <Body>
        <ActionsWrapper>
          <Button onClick={() => console.log('Do something with the position')}>
            Close position
          </Button>
        </ActionsWrapper>
      </Body>
    </Wrapper>
  )
}

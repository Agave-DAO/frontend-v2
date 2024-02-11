import { useState } from 'react'
import styled from 'styled-components'

import { Body, TitleValueType } from '@/src/components/asset/Asset'
import {
  MarketCell,
  Wrapper as MarketCellWrapper,
  MarketRow,
  MarketRows,
  MarketRowsCollapsable,
} from '@/src/components/asset/MarketCell'
import { AddToWallet } from '@/src/components/assets/AddToWallet'
import { ViewOnExplorer } from '@/src/components/assets/ViewOnExplorer'
import { ButtonToggleInfo } from '@/src/components/buttons/ButtonToggleInfo'
import { RewardPair } from '@/src/components/common/RewardPair'

const MarketCellPlaceholder = styled(MarketCellWrapper)``

const MarketCellActions = styled(MarketCellWrapper)`
  display: flex;
  flex-direction: row;
  column-gap: 5px;
  row-gap: 5px;
`

const MarketBodyActionWrapper = styled.div`
  column-gap: 15px;
  display: grid;
  grid-template-columns: 1fr 23px;
`

export interface Props {
  depositBaseRate: TitleValueType
  depositIncentivesRate: TitleValueType
  depositAPY: TitleValueType
  borrowBaseRate: TitleValueType
  borrowIncentivesRate: TitleValueType
  borrowVariableAPR: TitleValueType
}

export const MarketBody: React.FC<Props> = ({
  borrowBaseRate,
  borrowIncentivesRate,
  borrowVariableAPR,
  depositAPY,
  depositBaseRate,
  depositIncentivesRate,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const symbol = (restProps as { symbol: string }).symbol
  return (
    <Body {...restProps}>
      <MarketBodyActionWrapper>
        <MarketRows>
          <MarketRow>
            <MarketCell data={depositAPY} />
            <MarketCell data={borrowVariableAPR} />
            <MarketCellActions>
              <ViewOnExplorer hover small symbol={symbol} tooltip />
              <AddToWallet hover small symbol={symbol} tooltip />
            </MarketCellActions>
          </MarketRow>
          <MarketRowsCollapsable isOpen={isOpen}>
            <MarketRow>
              <MarketCell data={depositBaseRate} />
              <MarketCell data={borrowBaseRate} />
              <MarketCellPlaceholder />
            </MarketRow>
            <MarketRow>
              <MarketCell data={{ ...depositIncentivesRate, extraInfo: <RewardPair /> }} />
              <MarketCell data={{ ...borrowIncentivesRate, extraInfo: <RewardPair /> }} />
              <MarketCellPlaceholder />
            </MarketRow>
          </MarketRowsCollapsable>
        </MarketRows>
        <ButtonToggleInfo isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </MarketBodyActionWrapper>
    </Body>
  )
}

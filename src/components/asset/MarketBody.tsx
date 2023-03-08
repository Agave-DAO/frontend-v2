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
import { ButtonToggleInfo } from '@/src/components/buttons/ButtonToggleInfo'
import { RewardPair } from '@/src/components/common/RewardPair'

const MarketCellPlaceholder = styled(MarketCellWrapper)``

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
  borrowStableAPR: TitleValueType
}

export const MarketBody: React.FC<Props> = ({
  borrowBaseRate,
  borrowIncentivesRate,
  borrowStableAPR,
  borrowVariableAPR,
  depositAPY,
  depositBaseRate,
  depositIncentivesRate,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Body {...restProps}>
      <MarketBodyActionWrapper>
        <MarketRows>
          <MarketRow>
            <MarketCell data={depositAPY} />
            <MarketCell data={borrowVariableAPR} />
            <MarketCell data={borrowStableAPR} />
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

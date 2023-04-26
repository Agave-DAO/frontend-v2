import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { Position } from '@/src/pagePartials/strategy/positions/Position'

const Wrapper = styled.div``

export const PositionsList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    return (
      <Wrapper {...restProps}>
        <AssetsList maxWidth="none">
          {Array.from({ length: 17 }).map((item, index) => (
            <Position key={index}></Position>
          ))}
        </AssetsList>
      </Wrapper>
    )
  },
  ({ ...restProps }) => <div {...restProps}>PositionsList Loading...</div>,
)

import styled from 'styled-components'

import { AGAVEMini } from '@/src/components/assets/AGAVEMini'
import { GNOMini } from '@/src/components/assets/GNOMini'

const Wrapper = styled.div`
  align-items: center;
  column-gap: 2px;
  display: flex;
`

export const RewardPair: React.FC<{ size?: number }> = ({ size = 16, ...restProps }) => (
  <Wrapper {...restProps}>
    <GNOMini size={size} />
    <AGAVEMini size={size} />
  </Wrapper>
)

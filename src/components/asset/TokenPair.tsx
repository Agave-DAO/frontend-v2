import styled from 'styled-components'

import { AGAVEMini } from '@/src/components/assets/AGAVEMini'
import { GNOMini } from '@/src/components/assets/GNOMini'

const Wrapper = styled.div`
  align-items: center;
  column-gap: 2px;
  display: flex;
`

export const TokenPair: React.FC = ({ ...restProps }) => (
  <Wrapper {...restProps}>
    <GNOMini />
    <AGAVEMini />
  </Wrapper>
)

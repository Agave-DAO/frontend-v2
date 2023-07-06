import { PropsWithChildren } from 'react'
import styled from 'styled-components'

import { Asset, Body } from '@/src/components/asset/Asset'
import { PositionHead } from '@/src/components/asset/PositionHead'

const Wrapper = styled(Asset)`
  height: auto;

  &:last-child {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
`

interface Props extends PropsWithChildren {
  data: any
}

export const Position: React.FC<Props> = ({ children, data, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <PositionHead position={data} />
      {children && <Body>{children}</Body>}
    </Wrapper>
  )
}

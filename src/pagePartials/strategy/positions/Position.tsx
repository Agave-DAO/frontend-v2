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
  const { positionTokens, value } = data

  return (
    <Wrapper {...restProps}>
      <PositionHead positionTokens={positionTokens} value={value} />
      {children && <Body>{children}</Body>}
    </Wrapper>
  )
}

import styled from 'styled-components'

import { ContainerPadding } from '@/src/components/helpers/ContainerPadding'

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100%;
  width: ${({ theme: { layout } }) => layout.maxWidth};

  ${ContainerPadding}
`

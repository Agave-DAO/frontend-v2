import styled from 'styled-components'

import { Asset, Body, Head } from '@/src/components/asset/Asset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'

const Wrapper = styled(Asset)`
  height: auto;
`

const Button = styled(ActionButton)`
  margin-left: auto;
`

export const Position: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Head>something</Head>
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

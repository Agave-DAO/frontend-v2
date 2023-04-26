import styled from 'styled-components'

import { ActionText, Button, ButtonWrapper } from '@/src/components/card/FormCard'
import { Step } from '@/src/pagePartials/markets/stepper/types'

const Wrapper = styled(ButtonWrapper)``

export const StepAction = ({ actionText, description, mainAction, status }: Step) => {
  return (
    <Wrapper>
      <Button disabled={status === 'processing'} onClick={mainAction}>
        {actionText}
      </Button>
      <ActionText>{description}</ActionText>
    </Wrapper>
  )
}

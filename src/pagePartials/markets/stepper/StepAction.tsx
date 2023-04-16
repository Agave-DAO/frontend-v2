import styled from 'styled-components'

import { Button, ButtonWrapper, StepActionText } from '@/src/components/common/StepsCard'
import { Step } from '@/src/pagePartials/markets/stepper/types'

const Wrapper = styled(ButtonWrapper)``

export const StepAction = ({ actionText, description, mainAction, status }: Step) => {
  return (
    <Wrapper>
      <Button disabled={status === 'processing'} onClick={mainAction}>
        {actionText}
      </Button>
      <StepActionText>{description}</StepActionText>
    </Wrapper>
  )
}

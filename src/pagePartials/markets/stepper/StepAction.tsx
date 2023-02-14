import { Column } from './components/Column'
import { ButtonPrimary } from '@/src/components/buttons/Button'
import { Step } from '@/src/pagePartials/markets/stepper/types'

export function StepAction({ actionText, description, mainAction, status }: Step) {
  return (
    <Column>
      <ButtonPrimary disabled={status === 'processing'} onClick={mainAction}>
        {actionText}
      </ButtonPrimary>
      <p>{description}</p>
    </Column>
  )
}

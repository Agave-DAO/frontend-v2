import { Step } from '@/src/pagePartials/markets/stepper/types'

export function getCurrentStep(steps: Readonly<Step[]>) {
  return steps.find((step) => ['active', 'processing'].includes(step.status))
}

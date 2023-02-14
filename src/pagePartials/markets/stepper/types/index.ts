import { Dispatch } from 'react'

export type Step = {
  title: string
  description: string
  status: 'idle' | 'active' | 'processing' | 'completed'
  mainAction: () => Promise<unknown>
  actionText: string
  txHash?: string
  error?: string
  isLastToFinal?: boolean
  isFinal?: boolean
}

export type Action = {
  type: 'activate' | 'txSent' | 'txSucceed' | 'txFailed'
  payload?: string
}

export type StepWithDispatch = Readonly<[Step, Dispatch<Action>]>

export type StepWithActions = Step & {
  activate: () => void
  loading: () => void
  failed: () => void
  reset: () => void
  nextStep: (payload: string) => void
}

export type MetaSteps = {
  steps: StepWithActions[]
  currentStep: StepWithActions
  finalStep: StepWithActions
}

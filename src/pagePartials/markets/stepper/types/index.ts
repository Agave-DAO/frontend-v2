import { Dispatch } from 'react'

export type Step = {
  actionText: string
  description: string
  error?: string
  isFinal?: boolean
  isLastToFinal?: boolean
  mainAction: () => Promise<unknown>
  status: 'idle' | 'active' | 'processing' | 'completed'
  title: string
  txHash?: string
}

export type Action = {
  type: 'activate' | 'txSent' | 'txSucceed' | 'txFailed'
  payload?: string
}

export type StepWithDispatch = Readonly<[Step, Dispatch<Action>]>

export type StepWithActions = Step & {
  activate: () => void
  loading: () => void
  failed: (error?: string) => void
  reset: () => void
  nextStep: (payload: string) => void
}

export type MetaSteps = {
  steps: StepWithActions[]
  currentStep: StepWithActions
  finalStep: StepWithActions
}

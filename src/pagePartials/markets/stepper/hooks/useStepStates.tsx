import { useReducer } from 'react'

import { Action, Step, StepWithActions } from '@/src/pagePartials/markets/stepper/types'

export function useStepStates(initialState: StepWithActions) {
  const [state, dispatch] = useReducer(
    (state: Step, action: Action) => {
      switch (action.type) {
        case 'activate': {
          return {
            ...state,
            status: 'active',
          } as Step
        }
        case 'txSent': {
          return {
            ...state,
            status: 'processing',
          } as Step
        }
        case 'txSucceed': {
          return {
            ...state,
            status: 'completed',
            txHash: action.payload,
          } as Step
        }
        case 'txFailed': {
          return {
            ...state,
            status: 'active',
            error: action.payload,
          } as Step
        }
        default: {
          throw Error('Unknown action')
        }
      }
    },
    {
      txHash: '',
      error: '',
      isLastToFinal: false,
      isFinal: false,
      ...initialState,
    },
  )

  return [state, dispatch] as const
}

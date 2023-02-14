import { useMemo } from 'react'

import {
  MetaSteps,
  StepWithActions,
  StepWithDispatch,
} from '@/src/pagePartials/markets/stepper/types'

export const useMetaSteps = ({
  initialStepIndex = 0,
  stepsWithDispatchers,
}: {
  stepsWithDispatchers: StepWithDispatch[]
  initialStepIndex: number
}) => {
  return useMemo<MetaSteps>(() => {
    const finalStepIndex = stepsWithDispatchers.length - 1
    const lastToFinalStepIndex = finalStepIndex - 1

    let _steps: MetaSteps = {
      steps: [],
      currentStep: {} as StepWithActions,
      finalStep: {} as StepWithActions,
    }

    for (let index = 0; index < stepsWithDispatchers.length; index++) {
      const [step, dispatch] = stepsWithDispatchers[index]
      const [, nextDispatch] = stepsWithDispatchers[index + 1] || []
      const isLastToFinal = lastToFinalStepIndex === index

      const actions = {
        activate: () => dispatch({ type: 'activate' }),
        loading: () => dispatch({ type: 'txSent' }),
        failed: () => dispatch({ type: 'txFailed' }),
        reset: () => dispatch({ type: 'activate' }),
        nextStep: (payload: string) => {
          dispatch({ type: 'txSucceed', payload })

          if (isLastToFinal) {
            nextDispatch({ type: 'txSucceed' })
          } else {
            nextDispatch?.({ type: 'activate' })
          }
        },
      }

      if (index === finalStepIndex) {
        const _step = {
          ...step,
          ...actions,
        }

        _steps = {
          ..._steps,
          finalStep: {
            ..._step,
            mainAction: _step.mainAction.bind(_step),
          },
        }

        continue
      }

      if (index < initialStepIndex) {
        const _step = {
          ...step,
          ...actions,
          status: 'completed',
          isLastToFinal,
        } as const

        _steps = {
          ..._steps,
          steps: [
            ..._steps.steps,
            {
              ..._step,
              mainAction: _step.mainAction.bind(_step),
            },
          ],
        }

        continue
      }

      if (index === initialStepIndex) {
        const _step = {
          ...step,
          ...actions,
          status: step.status === 'idle' ? 'active' : step.status,
          isLastToFinal,
        } as const

        _steps = {
          ..._steps,
          steps: [
            ..._steps.steps,
            {
              ..._step,
              mainAction: _step.mainAction.bind(_step),
            },
          ],
          currentStep: {
            ..._step,
            mainAction: _step.mainAction.bind(_step),
          },
        }

        continue
      }

      const _step = {
        ...step,
        ...actions,
        status: 'idle',
        isLastToFinal,
      } as const

      _steps = {
        ..._steps,
        steps: [
          ..._steps.steps,
          {
            ..._step,
            mainAction: _step.mainAction.bind(_step),
          },
        ],
      }
    }

    return { ..._steps }
  }, [stepsWithDispatchers, initialStepIndex])
}

# Agave Tx Stepper
This component is used to display the current step of the Agave Tx process. It is used in the Agave Tx page.

## Structure
### Hooks
- `useMetaSteps` - This hook is used to get the current step of the Agave Tx process. It returns an object with the following properties:
  - `currentStep` - The current step of the Agave Tx process.
  - `steps` - An array of the steps of the Agave Tx process.
  - `finalStep` - The last step of the Agave Tx process. Usually the `success` step with a summary of the tx.

- `useStepStates` - This is basically a reducer that returns the state of a step and its dispatcher. It returns a tuple with the following properties:
  - `stepState` - The state of the step. It can be `pending`, `success` or `error`.
  - `dispatchStep` - The dispatcher to set the state of the step. It accepts a string with the state of the step and a payload with the tx hash or the error message if the step is in an `error` state.

### Components
- `Steps` - This component is used to display the steps of the Agave Tx process. It accepts the following props:
  - `info` - A ReactNode element where the summary.
  - `title` - A string with the title of the step.
  - `titleButton` - A ReactNode element with the button to display in the title.
  - `steps` - An array of the steps of the Agave Tx process.
  - `currentStep` - The current step of the Agave Tx process.
  - `finalStep` - The last step of the Agave Tx process. Usually the `success` step with a summary of the tx.

import { FallbackProps } from 'react-error-boundary'

export const GeneralError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div role="alert">
      <div>Oh no</div>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

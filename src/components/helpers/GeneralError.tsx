import styled from 'styled-components'

import { FallbackProps } from 'react-error-boundary'

import { Alert } from '@/src/components/assets/Alert'
import { ButtonPrimary } from '@/src/components/buttons/Button'
import { GenericError } from '@/src/components/common/GenericError'

const Button = styled(ButtonPrimary)`
  margin: 0 auto;
`

export const GeneralError = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <GenericError
      icon={<Alert />}
      text={
        <>
          {error.message}
          <br />
          <br />
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </>
      }
      title="Something went wrong"
    />
  )
}

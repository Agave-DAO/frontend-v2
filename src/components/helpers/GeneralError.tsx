import styled from 'styled-components'

import { FallbackProps } from 'react-error-boundary'

import { Alert } from '@/src/components/assets/Alert'
import { ButtonPrimary } from '@/src/components/buttons/Button'
import { GenericError } from '@/src/components/common/GenericError'

const Button = styled(ButtonPrimary)`
  margin: 0 auto;
`

interface ErrorMappings {
  [key: string]: {
    title: string
    text: string
  }
}

function error_message_parser(error_message: string): {
  title: string
  text: string
} {
  const error_mappings: ErrorMappings = {
    'code=NETWORK_ERROR': {
      title: 'Network Error',
      text: 'There was a problem communicating with the server.',
    },
  }

  for (const pattern in error_mappings) {
    if (error_message.includes(pattern)) {
      return error_mappings[pattern]
    }
  }

  return {
    title: 'Something went wrong',
    text: error_message,
  }
}

export const GeneralError: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { text, title } = error_message_parser(error.message)
  return (
    <GenericError
      icon={<Alert />}
      text={
        <>
          {text}
          <br />
          <br />
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </>
      }
      title={title}
    />
  )
}

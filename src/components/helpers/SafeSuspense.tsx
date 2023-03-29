import React, { ComponentType, FC, PropsWithChildren, Suspense } from 'react'

import { ErrorBoundary } from 'react-error-boundary'

import { GeneralError } from '@/src/components/helpers/GeneralError'
import { Loading } from '@/src/components/loading/Loading'
import isDev from '@/src/utils/isDev'
import { IntrinsicElements } from '@/types/utils'

type Props = {
  children: React.ReactNode
  fallback?: JSX.Element
}

function DefaultFallback(): JSX.Element {
  return <Loading />
}

export default function SafeSuspense({
  children,
  fallback = <DefaultFallback />,
}: PropsWithChildren<Props>): JSX.Element {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GeneralError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, info) => isDev && console.error(error, info)}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export function withGenericSuspense<TProps>(
  Component: ComponentType<TProps>,
  fallback?: FC<TProps>,
) {
  const displayName = Component.displayName || Component.name || 'Component'
  const ComponentWithGenericSuspense = (props: IntrinsicElements & TProps) => (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <GeneralError error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onError={(error, info) => isDev && console.error(error, info)}
    >
      <Suspense fallback={fallback ? fallback(props) : <DefaultFallback />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  )

  ComponentWithGenericSuspense.displayName = `withGenericSuspense(${displayName})`

  return ComponentWithGenericSuspense
}

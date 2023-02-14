import { PropsWithChildren } from 'react'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { BaseTitle } from '@/src/components/text/BaseTitle'

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

interface StepperProps extends PropsWithChildren {
  title: string
  titleButton: React.ReactNode
  info: React.ReactNode
}

export function Stepper({ children, info, title, titleButton }: StepperProps) {
  return (
    <BaseCard data-id="wizard">
      <Column data-id="step">
        <SimpleGrid data-id="step-header">
          <BaseTitle>{title}</BaseTitle>
          {titleButton}
        </SimpleGrid>
        <div data-id="step-info">{info}</div>
        <div data-id="step-body">{children}</div>
      </Column>
    </BaseCard>
  )
}

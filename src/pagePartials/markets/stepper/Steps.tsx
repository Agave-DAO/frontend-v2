import Link from 'next/link'
import styled from 'styled-components'

import { StepAction } from './StepAction'
import { StepCard } from './StepCard'
import { Link as BaseLink } from '@/src/components/assets/Link'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { Stepper } from '@/src/pagePartials/markets/stepper/Stepper'
import { Step } from '@/src/pagePartials/markets/stepper/types'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

const CHECK_MARK = '✓'

interface StepsProps {
  currentStep?: Step
  finalStep: Step
  info: React.ReactNode
  steps: Readonly<Step[]>
  title: string
  titleButton: React.ReactNode
}

export function Steps({ currentStep, finalStep, info, steps, title, titleButton }: StepsProps) {
  const { getExplorerUrl } = useWeb3ConnectedApp()

  return (
    <Stepper info={info} title={title} titleButton={titleButton}>
      <Column data-id="action">
        <SimpleGrid>
          {steps.map((step, index) => (
            <StepCard
              done={
                step.txHash ? (
                  <Link href={getExplorerUrl(step.txHash)} target="_blank">
                    <BaseLink />
                  </Link>
                ) : (
                  CHECK_MARK
                )
              }
              index={index + 1}
              key={step.title}
              status={step.status}
              title={step.title}
            />
          ))}
          <StepCard
            done={CHECK_MARK}
            index={steps.length + 1}
            status={finalStep.status}
            title={finalStep.title}
          />
        </SimpleGrid>
        <StepAction
          {...(currentStep && currentStep.status !== 'completed' ? currentStep : finalStep)}
        />
      </Column>
    </Stepper>
  )
}

import styled from 'styled-components'

import { Done } from '@/src/components/assets/Done'
import { ButtonType } from '@/src/components/common/StepAuxiliaryAction'
import { ExternalLink } from '@/src/components/common/StepsCard'
import { Step } from '@/src/pagePartials/markets/stepper/Step'
import { StepAction } from '@/src/pagePartials/markets/stepper/StepAction'
import { Stepper } from '@/src/pagePartials/markets/stepper/Stepper'
import { Step as StepType } from '@/src/pagePartials/markets/stepper/types'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  background-color: ${({ theme: { colors } }) => colors.secondary};
  border-radius: 16px;
  column-gap: 8px;
  display: flex;
  margin: 4px 0;
  padding: 8px;
`

interface StepsProps {
  currentStep?: StepType
  finalStep: StepType
  info: React.ReactNode
  steps: Readonly<StepType[]>
  title: string
  titleButton: ButtonType
}

export const Steps: React.FC<StepsProps> = ({
  currentStep,
  finalStep,
  info,
  steps,
  title,
  titleButton,
}) => {
  const { getExplorerUrl } = useWeb3ConnectedApp()

  return (
    <Stepper info={info} title={title} titleButton={titleButton}>
      <Wrapper>
        {steps.map((step, index) => (
          <Step
            done={
              step.txHash ? (
                <ExternalLink href={getExplorerUrl(step.txHash)}>Explorer</ExternalLink>
              ) : (
                <Done />
              )
            }
            index={index + 1}
            key={step.title}
            status={step.status}
            title={step.title}
          />
        ))}
        <Step
          done={<Done />}
          index={steps.length + 1}
          status={finalStep.status}
          title={finalStep.title}
        />
      </Wrapper>
      <StepAction
        {...(currentStep && currentStep.status !== 'completed' ? currentStep : finalStep)}
      />
    </Stepper>
  )
}

import { PropsWithChildren } from 'react'
import styled from 'styled-components'

import { ButtonType, StepAuxiliaryAction } from '@/src/components/common/StepAuxiliaryAction'
import { Rows as BaseRows, StepsCard } from '@/src/components/common/StepsCard'

const Rows = styled(BaseRows)`
  margin-bottom: 16px;
`

export const StepForm = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
`

interface Props extends PropsWithChildren {
  info: React.ReactNode
  title: string
  titleButton: ButtonType
  tokenWrapper?: React.ReactNode
}

export const Stepper: React.FC<Props> = ({
  children,
  info,
  title,
  titleButton,
  tokenWrapper,
  ...restProps
}) => (
  <StepsCard {...restProps}>
    {tokenWrapper}
    <StepAuxiliaryAction button={titleButton} title={title} />
    <Rows>{info}</Rows>
    <StepForm>{children}</StepForm>
  </StepsCard>
)

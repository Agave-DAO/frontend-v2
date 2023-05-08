import { PropsWithChildren } from 'react'
import styled from 'styled-components'

import { Rows as BaseRows, FormCard } from '@/src/components/card/FormCard'
import { ButtonType, TitleWithAction } from '@/src/components/common/TitleWithAction'

const TogglesWrapper = styled.div`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.black05};
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  column-gap: 8px;
  display: grid;
  grid-template-columns: max-content 1fr;
  margin-bottom: var(--padding-top);
  margin-left: calc(var(--padding-horizontal) * -1);
  margin-right: calc(var(--padding-horizontal) * -1);
  margin-top: calc(var(--padding-top) * -1);
  padding: 16px var(--padding-horizontal);
  row-gap: 4px;
`

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
  toggles?: React.ReactNode
}

export const Stepper: React.FC<Props> = ({
  children,
  info,
  title,
  titleButton,
  toggles,
  ...restProps
}) => (
  <FormCard {...restProps}>
    {toggles && <TogglesWrapper>{toggles}</TogglesWrapper>}
    <TitleWithAction button={titleButton} title={title} />
    <Rows>{info}</Rows>
    <StepForm>{children}</StepForm>
  </FormCard>
)

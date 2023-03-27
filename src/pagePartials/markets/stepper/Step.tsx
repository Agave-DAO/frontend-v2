import styled from 'styled-components'

import { MiniSpinner } from '@/src/components/loading/MiniSpinner'
import { Step as StepType } from '@/src/pagePartials/markets/stepper/types'

const Wrapper = styled.div<{ isActive?: boolean }>`
  align-items: center;
  background-color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.darkGreen : colors.mainDark4};
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.07), 0 9.24444px 25.4815px rgba(0, 0, 0, 0.0425185),
    0px 1.95556px 6.51852px rgba(0, 0, 0, 0.0274815);
  color: ${({ isActive, theme: { colors } }) => (isActive ? colors.textColor : colors.gray)};
  display: flex;
  flex-basis: 0;
  flex-direction: column;
  flex-grow: 1;
  min-height: 115px;
  padding: 16px;
`

const StepNumber = styled.div<{ isActive?: boolean }>`
  --size: 30px;

  align-items: center;
  background-color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.primary : colors.darkestGray};
  border-radius: 50%;
  color: ${({ isActive, theme: { colors } }) => (isActive ? colors.textColor : colors.gray)};
  display: flex;
  font-size: 1.6rem;
  font-weight: 700;
  height: var(--size);
  justify-content: center;
  line-height: 1;
  margin-bottom: 6px;
  width: var(--size);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --size: 40px;

    font-size: 1.8rem;
  }
`

const Title = styled.div<{ isActive?: boolean }>`
  color: ${({ isActive, theme: { colors } }) => (isActive ? colors.textColor : colors.gray)};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

interface Props {
  done?: React.ReactNode
  index: number
  status: StepType['status']
  title: string
}

export const Step = ({ done, index, status, title, ...restProps }: Props) => {
  const isActive = status === 'active' || status === 'completed' || status === 'processing'

  return (
    <Wrapper isActive={isActive} {...restProps}>
      <StepNumber isActive={isActive}>{index}</StepNumber>
      <Title isActive={isActive}>{title}</Title>
      {status === 'processing' && <MiniSpinner />}
      {status === 'completed' && done}
    </Wrapper>
  )
}

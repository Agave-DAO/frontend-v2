import { useState } from 'react'
import styled from 'styled-components'

import { Cooldown } from './Cooldown'
import { calculatePercentageTimePassedBetweenDates } from '@/src/utils/common'
import { useInterval } from '@/src/utils/useInterval'

const Bar = styled.div`
  background-color: ${({ theme: { colors } }) => colors.secondary};
  border-radius: 8px;
  border: 5px solid ${({ theme: { colors } }) => colors.secondary};
  margin: 0 0 24px;
  overflow: hidden;
  width: 100%;
`

const Progress = styled.div<{ progress?: number }>`
  background-color: ${({ theme: { colors } }) => colors.primary};
  border-radius: 6px;
  height: 5px;
  width: ${({ progress }) => progress || 0}%;
`

const TimeWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 0 24px;
  width: 100%;

  &:last-child {
    margin: 0;
  }
`

const Text = styled.span`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

/**
 * Shows a progress bar with the percentage of the time passed between two dates
 *  and it's updated every minute.
 */
export const ProgressBar: React.FC<{ start: Date; end: Date; label: string }> = ({
  end,
  label,
  start,
}) => {
  const [progress, setProgress] = useState(
    calculatePercentageTimePassedBetweenDates(start, end, new Date()),
  )
  useInterval(
    () => setProgress(calculatePercentageTimePassedBetweenDates(start, end, new Date())),
    1000 * 60,
  )

  return (
    <>
      <Bar>
        <Progress progress={progress} />
      </Bar>
      <TimeWrapper>
        <Text>{label}</Text>
        <Cooldown targetDate={end} />
      </TimeWrapper>
    </>
  )
}

import { useState } from 'react'
import styled from 'styled-components'

import { Cooldown } from './Cooldown'
import { calculatePercentageTimePassedBetweenDates } from '@/src/utils/common'
import { useInterval } from '@/src/utils/useInterval'

const ProgressBarStyled = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 10px 0;

  .progress-bar__bar {
    height: 100%;
    background-color: #00bfa5;
    transition: width 0.5s ease;
  }
`

// a component that shows a progress bar with the percentage of the time passed between two dates and it is updated every minute
export const ProgressBar = ({ end, start }: { start: Date; end: Date }) => {
  const [progress, setProgress] = useState(
    calculatePercentageTimePassedBetweenDates(start, end, new Date()),
  )

  useInterval(
    () => setProgress(calculatePercentageTimePassedBetweenDates(start, end, new Date())),
    1000 * 60,
  )

  return (
    <>
      <ProgressBarStyled>
        <div className="progress-bar__bar" style={{ width: `${progress}%` }} />
      </ProgressBarStyled>
      active for: <Cooldown targetDate={end} />
    </>
  )
}

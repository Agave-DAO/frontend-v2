import styled from 'styled-components'

import { BigNumber } from 'ethers'
import { parseInt } from 'lodash'

import { Amount } from '@/src/components/helpers/Amount'
import { SymbolPosition, formatAmount } from '@/src/utils/common'

const Wrapper = styled.div`
  column-gap: 2px;
  display: grid;
  grid-template-columns: 1fr 40px;
  height: 22px;
  width: 100%;
`

Wrapper.defaultProps = {
  className: 'healthFactor',
}

const ProgressBar = styled.div<{ progress: number }>`
  background-image: linear-gradient(90deg, #be4bc0 -0.19%, #019d8b 85.99%);
  border: 4px solid ${({ theme: { colors } }) => colors.darkGray};
  border-radius: 60px;
  box-shadow: 0px 17px 41px rgba(0, 0, 0, 0.1), 0px 8.60625px 17.8734px rgba(0, 0, 0, 0.0675),
    0px 3.4px 6.6625px rgba(0, 0, 0, 0.05), 0px 0.74375px 2.37031px rgba(0, 0, 0, 0.0325);
  height: 100%;
  position: relative;

  &::before {
    border-bottom: 8px solid ${({ theme: { colors } }) => colors.darkGray};
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    bottom: 0;
    content: '';
    height: 0;
    left: ${({ progress }) => progress}%;
    position: absolute;
    transform: translateX(-50%); // move transform origin to the center
    width: 0;
  }
`

ProgressBar.defaultProps = {
  className: 'progressBar',
}

const Value = styled.div`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.darkGray};
  border-radius: 16px;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.2rem;
  font-weight: 400;
  height: 100%;
  justify-content: center;
`

Value.defaultProps = {
  className: 'value',
}

export const HealthFactor: React.FC<{ value: BigNumber }> = ({ value, ...restProps }) => {
  /**
   * I'm gonna fake a range between 0 and 2 for this 'progress' thing.
   * Any value above 2 is changed to 2. The correct value (which could be anything) is displayed to the right, anyway.
   */
  const maxProgress = 2
  const formattedValue = parseFloat(formatAmount(value, 2, ''))
  const sanitizedValue =
    formattedValue < 0 ? 0 : formattedValue > maxProgress ? maxProgress : formattedValue
  const progress = (sanitizedValue * 100) / maxProgress
  /**
   * I'm forcing the minimum and maximum percentages only for display purposes.
   * Any number above or below these values will make the arrow go out of the progress bar.
   */
  const minPercentage = 2
  const maxPercentage = 98
  const sanitizedProgress =
    progress < minPercentage || isNaN(formattedValue)
      ? minPercentage
      : progress > maxPercentage
      ? maxPercentage
      : progress

  return (
    <Wrapper {...restProps}>
      <ProgressBar progress={sanitizedProgress} />
      <Value>
        <Amount displayDecimals={2} symbol={''} value={value} />
      </Value>
    </Wrapper>
  )
}

import { useMemo } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { HealthFactor as HFHelper } from '@/src/components/helpers/HealthFactor'
import { formatHealthFactor } from '@/src/utils/common'

const Wrapper = styled.div<{ size?: Size }>`
  column-gap: 2px;
  display: grid;
  grid-template-columns: 1fr 40px;
  height: ${({ size }) => (size === 'sm' ? '16px' : '22px')};
  min-width: 125px;
  width: 100%;
`

Wrapper.defaultProps = {
  className: 'healthFactor',
}

type Variant = 'light' | 'dark' | 'regular' | undefined

const ProgressBar = styled.div<{ progress: number; variant?: Variant; size?: Size }>`
  background-image: linear-gradient(90deg, #be4bc0 -0.19%, #019d8b 85.99%);
  border: ${({ size }) => (size === 'sm' ? '2px' : '4px')} solid
    ${({ theme: { colors }, variant }) =>
      variant === 'dark' ? colors.darkestGray : variant === 'light' ? '#fff' : colors.darkGray};
  border-radius: 60px;
  box-shadow: 0px 17px 41px rgba(0, 0, 0, 0.1), 0px 8.60625px 17.8734px rgba(0, 0, 0, 0.0675),
    0px 3.4px 6.6625px rgba(0, 0, 0, 0.05), 0px 0.74375px 2.37031px rgba(0, 0, 0, 0.0325);
  height: 100%;
  position: relative;

  &::before {
    border-bottom: 8px solid
      ${({ theme: { colors }, variant }) =>
        variant === 'dark' ? colors.darkestGray : variant === 'light' ? '#fff' : colors.darkGray};
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

const Value = styled.div<{ badgeVariant?: BadgeVariants }>`
  align-items: center;
  background-color: ${({ badgeVariant, theme: { colors } }) =>
    badgeVariant === 'light' ? colors.mainDark3 : colors.darkGray};
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

type Size = 'sm' | undefined
type BadgeVariants = 'light' | undefined

export const HealthFactor: React.FC<{
  badgeVariant?: BadgeVariants
  variant?: Variant
  size?: Size
  value: BigNumber
}> = ({ badgeVariant, size, value, variant, ...restProps }) => {
  /**
   * I'm gonna fake a range between 0 and 2 for this 'progress' thing.
   * Any value above 2 is changed to 2. The correct value (which could be anything) is displayed to the right, anyway.
   */
  const formatted = useMemo(() => parseFloat(formatHealthFactor(value)), [value])
  const maxValue = 2
  const sanitizedValue = useMemo(
    () => (isNaN(formatted) ? maxValue : formatted > maxValue ? maxValue : formatted),
    [formatted],
  )
  const progress = useMemo(() => (sanitizedValue * 100) / maxValue, [sanitizedValue])

  /**
   * I'm forcing the minimum and maximum percentages only for display purposes.
   * Any number above or below these values will make the arrow go out of the progress bar.
   */
  const minPercentage = 7
  const maxPercentage = 93
  const sanitizedProgress = useMemo(
    () =>
      progress < minPercentage
        ? minPercentage
        : progress > maxPercentage
        ? maxPercentage
        : progress,
    [progress],
  )

  return (
    <Wrapper size={size} {...restProps}>
      <ProgressBar progress={sanitizedProgress} size={size} variant={variant} />
      <Value badgeVariant={badgeVariant}>
        <HFHelper value={value} />
      </Value>
    </Wrapper>
  )
}

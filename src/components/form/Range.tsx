import { ChangeEvent } from 'react'
import styled, { css } from 'styled-components'

const SlideTrackCSS = css`
  -webkit-appearance: none;
  appearance: none;
  outline: none;
`

const SlideThumbCSS = css`
  --slide-thumb-size: 18px;

  -webkit-appearance: none;
  appearance: none;
  background-color: ${({ theme: { colors } }) => colors.primary};
  border-radius: 50%;
  box-shadow: 0 17px 41px rgba(0, 0, 0, 0.1), 0 8.60625px 17.8734px rgba(0, 0, 0, 0.0675),
    0 3.4px 6.6625px rgba(0, 0, 0, 0.05), 0 0.74375px 2.37031px rgba(0, 0, 0, 0.0325);
  height: var(--slide-thumb-size);
  width: var(--slide-thumb-size);
`

const RangeInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border-radius: 0;
  cursor: pointer;
  display: block;
  position: relative;
  width: 100%;
  z-index: 5;

  &::-webkit-slider-runnable-track {
    ${SlideTrackCSS}
  }

  &::-moz-range-track {
    ${SlideTrackCSS}
  }

  &::-ms-track {
    ${SlideTrackCSS}
  }

  &::-webkit-slider-thumb {
    ${SlideThumbCSS}
    margin-top: calc(var(--range-height) / -2);
  }

  &::-moz-range-thumb {
    ${SlideThumbCSS}
    margin-top: 0;
  }

  &::-ms-thumb {
    ${SlideThumbCSS}
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-ms-tooltip {
    display: none;
  }
`

RangeInput.defaultProps = {
  type: 'range',
}

const Wrapper = styled.div<{ progress?: number }>`
  --range-height: 11px;

  background-color: ${({ theme: { colors } }) => colors.lighterGray};
  border-radius: 6px;
  border: 2px solid ${({ theme: { colors } }) => colors.mainDark3};
  height: var(--range-height);
  position: relative;
  width: 100%;

  &::after {
    background-color: ${({ theme: { colors } }) => colors.primary};
    border-radius: 6px;
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: ${({ progress }) => progress}%;
    z-index: 1;
  }
`

export const Range: React.FC<{
  max: number
  min: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  step: number
  value: number
}> = ({ ...props }) => {
  const progress = ((props.value - props.min) / (props.max - props.min)) * 100

  return (
    <Wrapper progress={progress}>
      <RangeInput {...props} />
    </Wrapper>
  )
}

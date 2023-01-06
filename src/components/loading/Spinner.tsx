import styled, { keyframes } from 'styled-components'

const Wrapper = styled.div<{ dimensions: string; baseColor: string }>`
  --dimensions: ${({ dimensions }) => dimensions};
  --base-color: ${({ baseColor }) => baseColor};

  height: var(--dimensions);
  position: relative;
  width: var(--dimensions);
`

const mainCircleAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
`

const MainCircle = styled.div`
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-name: ${mainCircleAnimation};
  animation-timing-function: linear;
  border-radius: 50%;
  height: var(--dimensions);
  left: 0;
  position: absolute;
  top: 0;
  width: var(--dimensions);
  z-index: 1;

  box-sizing: content-box;
`

const MainCircleCounterClockwise = styled(MainCircle)`
  animation-direction: reverse;
  animation-duration: 6s;
`

const pointAnimation = keyframes`
  0% {
    opacity: var(--point-starting-opacity);
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }

  100% {
    opacity: var(--point-starting-opacity);
    transform: scale(1);
  }
`

const Point = styled.div`
  --point-dimensions: 5px;
  --point-starting-opacity: 0.2;

  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  animation-name: ${pointAnimation};
  animation-timing-function: linear;
  background-color: var(--base-color);
  border-radius: 50%;
  height: var(--point-dimensions);
  opacity: var(--point-starting-opacity);
  position: absolute;
  width: var(--point-dimensions);
`

const Point0 = styled(Point)`
  animation-delay: 0.2s;
  left: calc(calc(var(--dimensions) / 2) - calc(var(--point-dimensions) / 2));
  top: 0;
`

const Point1 = styled(Point)`
  animation-delay: 0.4s;
  right: 0;
  top: calc(calc(var(--dimensions) / 2) - calc(var(--point-dimensions) / 2));
`

const Point2 = styled(Point)`
  animation-delay: 0.6s;
  bottom: 0;
  left: calc(calc(var(--dimensions) / 2) - calc(var(--point-dimensions) / 2));
`

const Point3 = styled(Point)`
  animation-delay: 0.8s;
  left: 0;
  top: calc(calc(var(--dimensions) / 2) - calc(var(--point-dimensions) / 2));
`

const middleCircleAnimation = keyframes`
  0% {
    opacity: var(--middle-circle-starting-opacity);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: var(--middle-circle-starting-opacity);
  }
`

const MiddleCircle = styled.div`
  --middle-circle-dimensions: 30%;
  --middle-circle-starting-opacity: 0.1;

  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${middleCircleAnimation};
  animation-timing-function: linear;
  background-color: var(--base-color);
  border-radius: 50%;
  height: var(--middle-circle-dimensions);
  left: 50%;
  opacity: var(--middle-circle-starting-opacity);
  position: absolute;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: var(--middle-circle-dimensions);
`

export const Spinner: React.FC<{ dimensions?: string; baseColor?: string }> = ({
  baseColor = '#9a9a9a',
  dimensions = '34px',
  ...restProps
}) => (
  <Wrapper baseColor={baseColor} dimensions={dimensions} {...restProps}>
    <MainCircle>
      <Point0 />
      <Point1 />
      <Point2 />
      <Point3 />
      <MiddleCircle />
    </MainCircle>
    <MainCircleCounterClockwise>
      <Point0 />
      <Point1 />
      <Point2 />
      <Point3 />
    </MainCircleCounterClockwise>
  </Wrapper>
)

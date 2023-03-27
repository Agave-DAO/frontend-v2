import styled, { keyframes } from 'styled-components'

const Spinner = () => (
  <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M9.99991 20C10.502 20 10.909 19.593 10.909 19.0909V15.4545C10.909 14.9525 10.502 14.5454 9.99991 14.5454C9.49783 14.5454 9.09082 14.9525 9.09082 15.4545V19.0909C9.09082 19.593 9.49783 20 9.99991 20Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M9.99991 5.45459C10.502 5.45459 10.909 5.04758 10.909 4.5455V0.90913C10.909 0.407052 10.502 3.8303e-05 9.99991 3.8303e-05C9.49783 3.8303e-05 9.09082 0.407052 9.09082 0.90913V4.5455C9.09082 5.04758 9.49783 5.45459 9.99991 5.45459Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M2.92984 17.0699C3.28486 17.4249 3.86047 17.4249 4.21549 17.0699L6.78822 14.4972C7.14324 14.1422 7.14324 13.5666 6.78822 13.2115C6.4332 12.8565 5.85759 12.8565 5.50257 13.2115L2.92984 15.7843C2.57482 16.1393 2.57482 16.7149 2.92984 17.0699Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M13.2116 6.78818C13.5666 7.1432 14.1422 7.1432 14.4972 6.78818L17.07 4.21545C17.425 3.86042 17.425 3.28482 17.07 2.9298C16.7149 2.57477 16.1393 2.57477 15.7843 2.9298L13.2116 5.50253C12.8566 5.85755 12.8566 6.43315 13.2116 6.78818Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M0 10.0001C0 10.5022 0.407014 10.9092 0.909092 10.9092H4.54546C5.04754 10.9092 5.45455 10.5022 5.45455 10.0001C5.45455 9.49801 5.04754 9.091 4.54546 9.091H0.909092C0.407014 9.091 0 9.49801 0 10.0001Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M14.5454 10.0001C14.5454 10.5022 14.9524 10.9092 15.4545 10.9092H19.0909C19.5929 10.9092 20 10.5022 20 10.0001C20 9.49801 19.5929 9.091 19.0909 9.091H15.4545C14.9524 9.091 14.5454 9.49801 14.5454 10.0001Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M6.78822 6.78818C7.14325 6.43315 7.14325 5.85755 6.78822 5.50253L4.21549 2.9298C3.86047 2.57477 3.28486 2.57477 2.92984 2.9298C2.57482 3.28482 2.57482 3.86042 2.92984 4.21545L5.50257 6.78818C5.85759 7.1432 6.4332 7.1432 6.78822 6.78818Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M17.07 17.0699C17.425 16.7149 17.425 16.1393 17.07 15.7843L14.4972 13.2115C14.1422 12.8565 13.5666 12.8565 13.2116 13.2115C12.8566 13.5666 12.8566 14.1422 13.2116 14.4972L15.7843 17.0699C16.1393 17.4249 16.7149 17.4249 17.07 17.0699Z"
      fill="white"
      fillRule="evenodd"
    />
  </svg>
)

const mainCircleAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
`

const Wrapper = styled.div<{ size?: number }>`
  --size: ${({ size }) => size}px;

  height: var(--size);
  width: var(--size);

  > svg {
    display: block;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-name: ${mainCircleAnimation};
    animation-timing-function: linear;
    height: 100%;
    transform-origin: calc(var(--size) / 2) calc(var(--size) / 2));
    width: 100%;
    transform-box: fill-box;
  }
`

export const MiniSpinner: React.FC<{ size?: number }> = ({ size = 14, ...restProps }) => (
  <Wrapper size={size} {...restProps}>
    <Spinner />
  </Wrapper>
)

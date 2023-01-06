import styled, { keyframes } from 'styled-components'

const loadingAnimation = keyframes`
  0% {
    opacity: var(--inline-loading-opacity-start);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: var(--inline-loading-opacity-start);
  }
`

const Loading = styled.div`
  --inline-loading-opacity-start: 0.4;

  animation-delay: 0;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
  color: ${({ theme }) => theme.colors.textColor};
  font-style: italic;
`

export const InlineLoading: React.FC<{ text?: string }> = ({
  text = 'Loading...',
  ...restProps
}) => <Loading {...restProps}>{text}</Loading>

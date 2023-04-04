import styled, { keyframes } from 'styled-components'

const openAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const Overlay = styled.div`
  align-items: center;
  animation-duration: 0.3s;
  animation-iteration-count: 1;
  animation-name: ${openAnimation};
  animation-timing-function: linear;
  background-image: ${({ theme: { modal } }) => modal.overlayColor};
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  overflow: auto;
  padding: 10px;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
`

Overlay.defaultProps = {
  'aria-describedby': 'modalDescription',
  'aria-labelledby': 'modalTitle',
  className: 'modal',
}

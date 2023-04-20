import { HTMLAttributes, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { Body } from '@/src/components/modals/Body'
import { Header } from '@/src/components/modals/Header'
import ModalPortal from '@/src/components/modals/ModalPortal'
import { Overlay } from '@/src/components/modals/Overlay'

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 auto;
  max-width: 100%;
  width: ${({ theme: { layout } }) => layout.maxWidth};
`

const Contents = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

Contents.defaultProps = {
  id: 'modalDescription',
}

export interface Props extends HTMLAttributes<HTMLDivElement> {
  closeOnBackgroundClick?: boolean
  onClose?: () => void
}

export const Modal: React.FC<Props> = ({
  children,
  closeOnBackgroundClick = false,
  onClose,
  ...restProps
}) => {
  const close = useCallback(
    (e: { key: string }) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    window.addEventListener('keyup', close)

    return () => window.removeEventListener('keyup', close)
  }, [close, onClose])

  return (
    <ModalPortal>
      <Overlay
        onBlur={() => {
          /**
           * Remove event listener on blur to prevent multiple "close modal" event listeners
           * if the user opens another modal while this one is open
           */
          window.removeEventListener('keyup', close)
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (closeOnBackgroundClick && onClose) {
            onClose()
          }
        }}
        {...restProps}
      >
        <Inner>
          <Header onClose={onClose} />
          <Body
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Contents>{children}</Contents>
          </Body>
        </Inner>
      </Overlay>
    </ModalPortal>
  )
}

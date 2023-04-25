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
  isOpen: boolean
  onClose: () => void
}

export const Modal: React.FC<Props> = ({
  children,
  closeOnBackgroundClick = false,
  isOpen,
  onClose,
  ...restProps
}) => {
  const bodyDiv = document.getElementById('body') as HTMLElement
  const openModalClass = 'modalOpen'

  const closeModal = useCallback(() => {
    onClose()
    if (bodyDiv) {
      bodyDiv.classList.remove(openModalClass)
    }
  }, [onClose, bodyDiv])

  const closeOnESC = useCallback(
    (e: { key: string }) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    },
    [closeModal],
  )

  useEffect(() => {
    if (bodyDiv && isOpen) {
      bodyDiv.classList.add(openModalClass)
    } else if (bodyDiv && !isOpen) {
      bodyDiv.classList.remove(openModalClass)
    }
  }, [bodyDiv, isOpen])

  useEffect(() => {
    window.addEventListener('keyup', closeOnESC)
    return () => window.removeEventListener('keyup', closeOnESC)
  }, [closeOnESC])

  return isOpen ? (
    <ModalPortal>
      <Overlay
        onBlur={() => {
          /**
           * Remove event listener on blur to prevent multiple "close modal" event listeners
           * if the user opens another modal while this one is open
           */
          window.removeEventListener('keyup', closeOnESC)
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (closeOnBackgroundClick) {
            closeModal()
          }
        }}
        onFocus={() => {
          window.addEventListener('keyup', closeOnESC)
        }}
        {...restProps}
      >
        <Inner>
          <Header onClose={closeModal} />
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
  ) : null
}

import { HTMLAttributes, useEffect } from 'react'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import BaseModal from '@/src/components/modals/BaseModal'
import { Overlay } from '@/src/components/modals/Overlay'

const CloseSVG: React.FC = () => (
  <svg fill="none" height="31" viewBox="0 0 31 31" width="31" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#019D8B" height="30.0457" rx="15.0229" width="30.0463" />
    <path
      d="M21.5315 20.2138L9.83189 8.51414C9.54795 8.2302 9.02274 8.29501 8.65885 8.6589C8.29496 9.02279 8.23014 9.548 8.51409 9.83194L20.2137 21.5316C20.4977 21.8156 21.0229 21.7507 21.3868 21.3868C21.7507 21.0229 21.8155 20.4978 21.5315 20.2138Z"
      fill="white"
    />
    <path
      d="M9.83248 21.5317L21.5321 9.83201C21.8161 9.54807 21.7513 9.02286 21.3874 8.65897C21.0235 8.29508 20.4983 8.23027 20.2143 8.51421L8.51468 20.2139C8.23071 20.4978 8.29555 21.023 8.65944 21.3869C9.02333 21.7508 9.54851 21.8156 9.83248 21.5317Z"
      fill="white"
    />
  </svg>
)

const Card = styled(BaseCard)<{ size?: modalSize }>`
  background: ${({ theme: { colors } }) => colors.mainDark1};
  box-shadow: 0px 34.9835px 54.876px rgba(0, 0, 0, 0.17),
    0px 13.4751px 17.479px rgba(0, 0, 0, 0.103259), 0px 2.85051px 4.47138px rgba(0, 0, 0, 0.0667407);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 100%;
  min-width: fit-content;
  padding: 20px;
  position: relative;
  width: ${({ size }) =>
    size === 'sm' ? '325px' : size === 'md' ? '500px' : size === 'lg' ? '720px' : `${size}`};
`

Card.defaultProps = {
  'aria-describedby': 'modalDescription',
  'aria-labelledby': 'modalTitle',
  className: 'modalCard',
  onClick: (e) => {
    e.stopPropagation()
  },
  role: 'dialog',
  size: 'sm',
}

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 24px;
  text-align: left;
  width: 100%;
`

Title.defaultProps = {
  id: 'modalTitle',
}

const Close = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: -12px;
  top: -12px;
  z-index: 10;

  &:active {
    opacity: 0.7;
  }
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

export type modalSize = 'sm' | 'md' | 'lg' | string

interface Props extends HTMLAttributes<HTMLDivElement> {
  closeOnBackgroundClick?: boolean
  onClose?: () => void
  size?: modalSize
  title?: string
}

export const Modal: React.FC<Props> = ({
  children,
  closeOnBackgroundClick = true,
  onClose,
  size = 'sm',
  title,
  ...restProps
}: Props) => {
  const onCloseIsAFunction = onClose && typeof onClose === 'function'
  const onCloseModal = onCloseIsAFunction ? onClose : undefined

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === 'Escape' && onCloseIsAFunction) {
        onClose()
      }
    }

    window.addEventListener('keyup', close)

    return () => window.removeEventListener('keyup', close)
  }, [onClose, onCloseIsAFunction])

  return (
    <BaseModal>
      <Overlay onClick={closeOnBackgroundClick ? onCloseModal : undefined} {...restProps}>
        <Card size={size}>
          {title && <Title>{title}</Title>}
          {onCloseIsAFunction && (
            <Close onClick={onCloseModal} tabIndex={-1}>
              <CloseSVG />
            </Close>
          )}
          <Contents>{children}</Contents>
        </Card>
      </Overlay>
    </BaseModal>
  )
}

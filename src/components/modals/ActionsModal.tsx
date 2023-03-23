import { useRouter } from 'next/router'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'

import { Close as BaseClose } from '@/src/components/assets/Close'
import { LogoMini } from '@/src/components/assets/LogoMini'
import { ButtonMini } from '@/src/components/buttons/Button'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { BorrowRepay } from '@/src/components/modals/BorrowRepay'
import { DepositWithdraw } from '@/src/components/modals/DepositWithdraw'
import { TokenDropdown } from '@/src/components/token/TokenDropdown'
import { useActionsContext } from '@/src/providers/actionsProvider'
import { BorrowRepayTabs, DepositWithdrawTabs } from '@/types/modal'
import { Token } from '@/types/token'

const openAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const Wrapper = styled.div`
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

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 auto;
  max-width: 100%;
  width: ${({ theme: { layout } }) => layout.maxWidth};
`

const Head = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--header-full-height);
  justify-content: space-between;
  margin-bottom: 40px;
  padding-top: var(--header-padding-top);
`

const Logo = styled(LogoMini)`
  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 46px;
    width: 48px;
  }
`

const Body = styled.div`
  display: flex;
  flex-grow: 1;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background: linear-gradient(
      180deg,
      ${({ theme: { colors } }) => colors.darkBackground02} 0%,
      ${({ theme: { colors } }) => colors.darkBackground0} 25.31%
    );
    border-radius: 24px;
    padding: 56px 95px;
  }
`

const Close = styled(BaseClose)`
  cursor: pointer;

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

const ActionsWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 56px;
  }
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  closeOnBackgroundClick?: boolean
  onClose: () => void
}

interface ActionsModalProps extends Props {
  onTokenSelect: (token: Token | null) => void
  symbol: string
}

interface DepositWithdrawModalProps extends Props {
  activeTab?: DepositWithdrawTabs
  token: Token | null
}

interface BorrowRepayModalProps extends Props {
  activeTab?: BorrowRepayTabs
  token: Token | null
}

export const ActionsModal: React.FC<ActionsModalProps> = ({
  children,
  closeOnBackgroundClick = false,
  onClose,
  onTokenSelect,
  symbol,
  ...restProps
}) => {
  const portal = document.getElementById('modals') as HTMLElement
  const body = document.getElementById('body') as HTMLElement
  const router = useRouter()
  const { openModal } = useActionsContext()
  const openModalClass = 'modalOpen'

  const closeModal = useCallback(() => {
    if (body) {
      body.classList.remove(openModalClass)
    }
    onClose()
  }, [body, onClose])

  const closeModalAndGo = useCallback(() => {
    router.push(`/markets/${symbol}`)
    closeModal()
  }, [closeModal, router, symbol])

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keyup', close)

    return () => window.removeEventListener('keyup', close)
  }, [closeModal])

  useEffect(() => {
    if (openModal && body) {
      body.classList.add(openModalClass)
    }
  }, [body, openModal])

  return (
    portal &&
    ReactDOM.createPortal(
      <Wrapper
        aria-describedby="modalDescription"
        aria-labelledby="modalTitle"
        className="modal"
        onClick={closeOnBackgroundClick ? closeModal : undefined}
        {...restProps}
      >
        <RequiredConnection>
          <Inner>
            <Head
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Logo />
              <Close onClick={closeModal} tabIndex={-1} />
            </Head>
            <Body
              onClick={(e) => {
                e.stopPropagation()
              }}
              role="dialog"
            >
              <Contents id="modalDescription">
                <ActionsWrapper>
                  <TokenDropdown activeTokenSymbol={symbol} onChange={onTokenSelect} />
                  <ButtonMini onClick={closeModalAndGo} variant="dark">
                    More Info
                  </ButtonMini>
                </ActionsWrapper>
                {children}
              </Contents>
            </Body>
          </Inner>
        </RequiredConnection>
      </Wrapper>,
      portal,
    )
  )
}

export const DepositWithdrawModal: React.FC<DepositWithdrawModalProps> = ({
  activeTab,
  token,
  ...restProps
}) => {
  const [currentToken, setCurrentToken] = useState<Token | null>(token)
  const onTokenSelect = (token: Token | null) => {
    setCurrentToken(token)
  }

  return (
    <ActionsModal onTokenSelect={onTokenSelect} symbol={currentToken?.symbol || ''} {...restProps}>
      <DepositWithdraw activeTab={activeTab} token={currentToken} />
    </ActionsModal>
  )
}

export const BorrowRepayModal: React.FC<BorrowRepayModalProps> = ({
  activeTab,
  token,
  ...restProps
}) => {
  const [currentToken, setCurrentToken] = useState<Token | null>(token)
  const onTokenSelect = (token: Token | null) => {
    setCurrentToken(token)
  }

  return (
    <ActionsModal onTokenSelect={onTokenSelect} symbol={currentToken?.symbol || ''} {...restProps}>
      <BorrowRepay activeTab={activeTab} token={currentToken} />
    </ActionsModal>
  )
}

import { useRouter } from 'next/router'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonMini } from '@/src/components/buttons/Button'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import Modal from '@/src/components/modals/BaseModal'
import { Body } from '@/src/components/modals/Body'
import { BorrowRepay } from '@/src/components/modals/BorrowRepay'
import { DepositWithdraw } from '@/src/components/modals/DepositWithdraw'
import { Header } from '@/src/components/modals/Header'
import { Overlay } from '@/src/components/modals/Overlay'
import { TokenDropdown } from '@/src/components/token/TokenDropdown'
import { BorrowRepayTabs, DepositWithdrawTabs } from '@/types/modal'
import { Token } from '@/types/token'

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
  const router = useRouter()

  const closeModalAndGo = useCallback(() => {
    router.push(`/markets/${symbol}`)
    onClose()
  }, [onClose, router, symbol])

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keyup', close)

    return () => window.removeEventListener('keyup', close)
  }, [onClose])

  return (
    <Modal>
      <Overlay
        aria-describedby="modalDescription"
        aria-labelledby="modalTitle"
        className="modal"
        onClick={closeOnBackgroundClick ? onClose : undefined}
        {...restProps}
      >
        <RequiredConnection>
          <Inner>
            <Header onClose={onClose} />
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
      </Overlay>
    </Modal>
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

import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { ButtonMini } from '@/src/components/buttons/ButtonMini'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { BorrowRepay } from '@/src/components/modals/BorrowRepay'
import { DepositWithdraw } from '@/src/components/modals/DepositWithdraw'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { TokenDropdown } from '@/src/components/token/TokenDropdown'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { BorrowRepayTabs, DepositWithdrawTabs } from '@/types/modal'
import { Token } from '@/types/token'

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

interface Props extends ModalProps {
  onTokenSelect: (token: Token | null) => void
  symbol: string
}

const ActionsModal: React.FC<Props> = ({
  children,
  onClose,
  onTokenSelect,
  symbol,
  ...restProps
}) => {
  const router = useRouter()

  const closeModalAndGo = useCallback(() => {
    router.push(`/markets/${symbol}`)

    if (onClose) {
      onClose()
    }
  }, [onClose, router, symbol])

  return (
    <Modal onClose={onClose} {...restProps}>
      <RequiredConnection>
        <>
          <ActionsWrapper>
            <TokenDropdown activeTokenSymbol={symbol} onChange={onTokenSelect} />
            <ButtonMini onClick={closeModalAndGo} variant="dark">
              More Info
            </ButtonMini>
          </ActionsWrapper>
          {children}
        </>
      </RequiredConnection>
    </Modal>
  )
}

interface DepositWithdrawModalProps extends ModalProps {
  activeTab?: DepositWithdrawTabs
  token: Token | null
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
      <DepositWithdraw activeTab={activeTab} onTokenSelect={onTokenSelect} token={currentToken} />
    </ActionsModal>
  )
}

interface BorrowRepayModalProps extends ModalProps {
  activeTab?: BorrowRepayTabs
  mode: InterestRateMode
  token: Token | null
}

export const BorrowRepayModal: React.FC<BorrowRepayModalProps> = ({
  activeTab,
  mode,
  token,
  ...restProps
}) => {
  const [currentToken, setCurrentToken] = useState<Token | null>(token)
  const [interestRateMode, setInterestRateMode] = useState<InterestRateMode>(() => mode)
  const onTokenSelect = (token: Token | null) => {
    setCurrentToken(token)
  }

  const onInterestRateSelect = (mode: InterestRateMode) => {
    setInterestRateMode(mode)
  }

  return (
    <ActionsModal onTokenSelect={onTokenSelect} symbol={currentToken?.symbol || ''} {...restProps}>
      <BorrowRepay
        activeTab={activeTab}
        interestRateMode={interestRateMode}
        onInterestRateSelect={onInterestRateSelect}
        onTokenSelect={onTokenSelect}
        token={currentToken}
      />
    </ActionsModal>
  )
}

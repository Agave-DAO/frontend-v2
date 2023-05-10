import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useTokenInfo } from '@/src/hooks/useTokenInfo'
import {
  BorrowRepayModal,
  DepositWithdrawModal,
} from '@/src/pagePartials/markets/modals/ActionsModal'
import { BorrowRepayTabs, DepositWithdrawTabs, Modals } from '@/types/modal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TokenActionsModalsContext = createContext({} as any)

const TokenActionsModalContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<{
    activeTab?: DepositWithdrawTabs | BorrowRepayTabs
    modalName: Modals
    mode?: InterestRateMode
    tokenAddress: string
  } | null>(null)
  const token = useTokenInfo(currentModal?.tokenAddress)
  const closeModal = () => setCurrentModal(null)

  const openDepositWithdrawModal = ({
    activeTab,
    tokenAddress,
  }: {
    tokenAddress: string
    activeTab?: DepositWithdrawTabs
  }) => {
    setCurrentModal({
      modalName: 'depositWithdraw',
      tokenAddress,
      activeTab,
    })
  }

  const openBorrowRepayModal = ({
    activeTab,
    mode,
    tokenAddress,
  }: {
    activeTab?: BorrowRepayTabs
    mode?: InterestRateMode
    tokenAddress: string
  }) => {
    setCurrentModal({
      activeTab,
      modalName: 'borrowRepay',
      mode,
      tokenAddress,
    })
  }

  const values = {
    closeModal,
    currentModal,
    isOpen: currentModal,
    openBorrowRepayModal,
    openDepositWithdrawModal,
  }

  return (
    <TokenActionsModalsContext.Provider value={values}>
      {!currentModal ? children : null}
      {token && (
        <>
          <DepositWithdrawModal
            activeTab={currentModal?.activeTab as DepositWithdrawTabs}
            isOpen={currentModal?.modalName === 'depositWithdraw'}
            onClose={closeModal}
            token={token}
          />
          <BorrowRepayModal
            activeTab={currentModal?.activeTab as BorrowRepayTabs}
            isOpen={currentModal?.modalName === 'borrowRepay'}
            mode={currentModal?.mode ?? InterestRateMode.variable}
            onClose={closeModal}
            token={token}
          />
        </>
      )}
    </TokenActionsModalsContext.Provider>
  )
}

export default TokenActionsModalContextProvider

export const useTokenActionsModalsContext = () => {
  return useContext(TokenActionsModalsContext)
}

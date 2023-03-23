import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { BorrowRepayModal, DepositWithdrawModal } from '@/src/components/modals/ActionsModal'
import { getTokenInfo } from '@/src/utils/getTokenInfo'
import { BorrowRepayTabs, DepositWithdrawTabs, Modals } from '@/types/modal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActionsContext = createContext({} as any)

const ActionsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [openModal, setOpenModal] = useState<{
    activeTab?: DepositWithdrawTabs | BorrowRepayTabs
    modalName: Modals
    tokenAddress: string
  } | null>(null)

  const closeModal = () => setOpenModal(null)
  const token = openModal?.tokenAddress ? getTokenInfo(openModal?.tokenAddress) : null

  const openDepositWithdrawModal = (tokenAddress: string, activeTab?: DepositWithdrawTabs) => {
    setOpenModal({
      modalName: 'depositWithdraw',
      tokenAddress,
      activeTab,
    })
  }

  const openBorrowRepayModal = (tokenAddress: string, activeTab?: BorrowRepayTabs) => {
    setOpenModal({
      modalName: 'borrowRepay',
      tokenAddress,
      activeTab,
    })
  }

  const values = {
    closeModal,
    openModal: openModal,
    openBorrowRepayModal,
    openDepositWithdrawModal,
  }

  return (
    <ActionsContext.Provider value={values}>
      {!openModal ? children : null}
      {token && openModal?.modalName === 'depositWithdraw' && (
        <DepositWithdrawModal
          activeTab={openModal?.activeTab as DepositWithdrawTabs}
          onClose={closeModal}
          token={token}
        />
      )}
      {token && openModal?.modalName === 'borrowRepay' && (
        <BorrowRepayModal
          activeTab={openModal?.activeTab as BorrowRepayTabs}
          onClose={closeModal}
          token={token}
        />
      )}
    </ActionsContext.Provider>
  )
}

export default ActionsContextProvider

export const useActionsContext = () => {
  return useContext(ActionsContext)
}

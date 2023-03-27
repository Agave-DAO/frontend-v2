import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

import { BorrowRepayModal, DepositWithdrawModal } from '@/src/components/modals/ActionsModal'
import { MinHealthConfigurationModal } from '@/src/components/modals/MinHealthConfigurationModal'
import { getTokenInfo } from '@/src/utils/getTokenInfo'
import { BorrowRepayTabs, DepositWithdrawTabs, Modals } from '@/types/modal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalsContext = createContext({} as any)

const ModalsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<{
    activeTab?: DepositWithdrawTabs | BorrowRepayTabs
    modalName: Modals
    tokenAddress: string
  } | null>(null)
  const bodyDiv = document.getElementById('body') as HTMLElement
  const token = currentModal?.tokenAddress ? getTokenInfo(currentModal?.tokenAddress) : null
  const openModalClass = 'modalOpen'
  const [showMinHealthConfiguration, setShowMinHealthConfiguration] = useState<boolean | null>(null)
  const someModalIsOpen = currentModal || showMinHealthConfiguration

  const closeModal = () => setCurrentModal(null)

  useEffect(() => {
    if (someModalIsOpen && bodyDiv) {
      bodyDiv.classList.add(openModalClass)
    } else if (!someModalIsOpen && bodyDiv) {
      bodyDiv.classList.remove(openModalClass)
    }
  }, [bodyDiv, someModalIsOpen])

  const openDepositWithdrawModal = (tokenAddress: string, activeTab?: DepositWithdrawTabs) => {
    setCurrentModal({
      modalName: 'depositWithdraw',
      tokenAddress,
      activeTab,
    })
  }

  const openBorrowRepayModal = (tokenAddress: string, activeTab?: BorrowRepayTabs) => {
    setCurrentModal({
      modalName: 'borrowRepay',
      tokenAddress,
      activeTab,
    })
  }

  const values = {
    closeModal,
    currentModal,
    openBorrowRepayModal,
    openDepositWithdrawModal,
    openMinHealthConfigurationModal: () => setShowMinHealthConfiguration(true),
  }

  return (
    <ModalsContext.Provider value={values}>
      {!currentModal ? children : null}
      {token && currentModal?.modalName === 'depositWithdraw' && (
        <DepositWithdrawModal
          activeTab={currentModal?.activeTab as DepositWithdrawTabs}
          onClose={closeModal}
          token={token}
        />
      )}
      {token && currentModal?.modalName === 'borrowRepay' && (
        <BorrowRepayModal
          activeTab={currentModal?.activeTab as BorrowRepayTabs}
          onClose={closeModal}
          token={token}
        />
      )}
      {showMinHealthConfiguration && (
        <MinHealthConfigurationModal onClose={() => setShowMinHealthConfiguration(false)} />
      )}
    </ModalsContext.Provider>
  )
}

export default ModalsContextProvider

export const useModalsContext = () => {
  return useContext(ModalsContext)
}

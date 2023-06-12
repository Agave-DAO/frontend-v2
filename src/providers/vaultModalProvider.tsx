import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { ClosePosition } from '@/src/pagePartials/strategy/modals/ClosePosition'
import { DepositWithdraw } from '@/src/pagePartials/strategy/modals/DepositWithdraw'
import VaultModal from '@/src/pagePartials/strategy/modals/VaultModal'
import { DepositWithdrawTabs } from '@/types/modal'
import { Strategy } from '@/types/strategy'

type vaultAddress = string | undefined

type ModalTypes = 'vault' | 'close' | Strategy | DepositWithdrawTabs | false

interface ContextProps {
  isOpen: ModalTypes
  closeModal: () => void
  openCreateVaultModal: (vaultAddress?: string, vaultName?: string) => void
  openDepositWithdrawModal: (activeTab: DepositWithdrawTabs) => void
  openClosePositionModal: () => void
}

const VaultModalContext = createContext({} as ContextProps)

const VaultModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showModal, setShowModal] = useState<ModalTypes>(false)
  const [vaultAddress, setVaultAddress] = useState<vaultAddress>()
  const [vaultName, setVaultName] = useState<string>()
  const closeModal = () => setShowModal(false)

  const values = {
    isOpen: showModal,
    closeModal,
    openCreateVaultModal: (vaultAddress?: vaultAddress, vaultName?: string) => {
      setVaultAddress(vaultAddress)
      setVaultName(vaultName)
      setShowModal('vault')
    },
    openDepositWithdrawModal: (activeTab: DepositWithdrawTabs) => {
      setShowModal(activeTab)
    },
    openClosePositionModal: () => {
      setShowModal('close')
    },
  }

  return (
    <VaultModalContext.Provider value={values}>
      {children}
      <RequiredConnection>
        <VaultModal
          isOpen={showModal === 'vault'}
          onClose={() => setShowModal(false)}
          vaultAddress={vaultAddress}
          vaultName={vaultName}
        />
        <DepositWithdraw
          activeTab={showModal === 'deposit' ? 'deposit' : 'withdraw'}
          isOpen={showModal === 'deposit' || showModal === 'withdraw'}
          onClose={() => setShowModal(false)}
        />
        <ClosePosition isOpen={showModal === 'close'} onClose={() => setShowModal(false)} />
      </RequiredConnection>
    </VaultModalContext.Provider>
  )
}

export default VaultModalProvider

export const useVaultModalContext = () => {
  return useContext(VaultModalContext)
}

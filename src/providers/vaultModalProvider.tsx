import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { useGetQueryParam } from '@/src/hooks/useGetQueryParam'
import { ClosePosition } from '@/src/pagePartials/strategy/modals/ClosePosition'
import { DepositWithdraw } from '@/src/pagePartials/strategy/modals/DepositWithdraw'
import VaultModal from '@/src/pagePartials/strategy/modals/VaultModal'
import { DepositWithdrawTabs } from '@/types/modal'
import { Strategy } from '@/types/strategy'

type vaultAddress = string

type ModalTypes = 'vault' | 'close' | Strategy | DepositWithdrawTabs | false

interface ContextProps {
  isOpen: ModalTypes
  closeModal: () => void
  openCreateVaultModal: (vaultName?: string) => void
  openDepositWithdrawModal: (activeTab: DepositWithdrawTabs) => void
  openClosePositionModal: () => void
  vaultAddress: vaultAddress
  vaultName: string
  setVaultName: (name: string) => void
}

const VaultModalContext = createContext({} as ContextProps)

const VaultModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showModal, setShowModal] = useState<ModalTypes>(false)
  const [vaultName, setVaultName] = useState<string>('')
  const closeModal = () => setShowModal(false)
  const vaultAddress = useGetQueryParam('vault') || ''

  const values = {
    isOpen: showModal,
    closeModal,
    vaultName: vaultName,
    vaultAddress: vaultAddress,
    setVaultName: (name: string) => setVaultName(name),
    openCreateVaultModal: () => {
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
        <VaultModal isOpen={showModal === 'vault'} onClose={() => setShowModal(false)} />
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

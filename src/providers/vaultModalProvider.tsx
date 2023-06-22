import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { ClosePosition } from '@/src/pagePartials/strategy/modals/ClosePosition'
import { DepositWithdraw } from '@/src/pagePartials/strategy/modals/DepositWithdraw'
import VaultModal from '@/src/pagePartials/strategy/modals/VaultModal'
import { DepositWithdrawTabs } from '@/types/modal'
import { Strategy } from '@/types/strategy'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VaultModalContext = createContext({} as any)

type vaultAddress = string | undefined

type ModalTypes = 'vault' | 'close' | Strategy | DepositWithdrawTabs | false

const VaultModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showModal, setShowModal] = useState<ModalTypes>(false)
  const [vaultAddress, setVaultAddress] = useState<vaultAddress>()
  const closeModal = () => setShowModal(false)

  const values = {
    isOpen: showModal,
    closeModal,
    openCreateVaultModal: (vaultAddress: vaultAddress) => {
      setVaultAddress(vaultAddress)
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

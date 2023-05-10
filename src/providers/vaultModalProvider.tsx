import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { DepositWithdraw } from '@/src/pagePartials/strategy/modals/DepositWithdraw'
import { VaultModal } from '@/src/pagePartials/strategy/modals/VaultModal'
import { DepositWithdrawTabs } from '@/types/modal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VaultModalContext = createContext({} as any)

type vaultAddress = string | undefined

const VaultModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showModal, setShowModal] = useState<'vault' | DepositWithdrawTabs | false>(false)
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
  }

  return (
    <VaultModalContext.Provider value={values}>
      {children}
      <VaultModal
        isOpen={showModal === 'vault'}
        onClose={() => setShowModal(false)}
        vaultAddress={vaultAddress}
      />
      <DepositWithdraw
        activeTab={showModal === 'deposit' ? 'deposit' : 'withdraw'}
        isOpen={showModal === 'deposit' || showModal === 'withdraw' ? true : false}
        onClose={() => setShowModal(false)}
      />
    </VaultModalContext.Provider>
  )
}

export default VaultModalProvider

export const useVaultModalContext = () => {
  return useContext(VaultModalContext)
}

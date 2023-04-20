import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { VaultModal } from '@/src/components/modals/VaultModal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VaultModalContext = createContext({} as any)

const VaultModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const closeModal = () => setShowModal(false)

  const values = {
    isOpen: showModal,
    closeModal,
    openVaultModal: () => setShowModal(true),
  }

  return (
    <VaultModalContext.Provider value={values}>
      {children}
      <VaultModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </VaultModalContext.Provider>
  )
}

export default VaultModalProvider

export const useVaultModalContext = () => {
  return useContext(VaultModalContext)
}

import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { VaultModal } from '@/src/pagePartials/strategy/modals/VaultModal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VaultModalContext = createContext({} as any)

type vaultAddress = string | undefined

const VaultModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const [vaultAddress, setVaultAddress] = useState<vaultAddress>()
  const closeModal = () => setShowModal(false)

  const values = {
    isOpen: showModal,
    closeModal,
    openCreateVaultModal: (vaultAddress: vaultAddress) => {
      setVaultAddress(vaultAddress)
      setShowModal(true)
    },
  }

  return (
    <VaultModalContext.Provider value={values}>
      {children}
      <VaultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        vaultAddress={vaultAddress}
      />
    </VaultModalContext.Provider>
  )
}

export default VaultModalProvider

export const useVaultModalContext = () => {
  return useContext(VaultModalContext)
}

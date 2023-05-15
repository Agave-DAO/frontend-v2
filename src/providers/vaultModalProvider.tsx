import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { DepositWithdraw } from '@/src/pagePartials/strategy/modals/DepositWithdraw'
import { Strategies } from '@/src/pagePartials/strategy/modals/Strategies'
import VaultModal from '@/src/pagePartials/strategy/modals/VaultModal'
import { DepositWithdrawTabs } from '@/types/modal'
import { Strategy } from '@/types/strategy'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VaultModalContext = createContext({} as any)

type vaultAddress = string | undefined

type ModalTypes = 'vault' | Strategy | DepositWithdrawTabs | false

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
    openCollateralSwapModal: () => {
      setShowModal('collateralSwap')
    },
    openLongModal: () => {
      setShowModal('long')
    },
    openShortModal: () => {
      setShowModal('short')
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
          isOpen={showModal === 'deposit' || showModal === 'withdraw' ? true : false}
          onClose={() => setShowModal(false)}
        />
        <Strategies
          currentStrategy={
            showModal === 'collateralSwap'
              ? 'collateralSwap'
              : showModal === 'long'
              ? 'long'
              : 'short'
          }
          isOpen={showModal === 'collateralSwap' || showModal === 'long' || showModal === 'short'}
          onClose={() => setShowModal(false)}
        />
      </RequiredConnection>
    </VaultModalContext.Provider>
  )
}

export default VaultModalProvider

export const useVaultModalContext = () => {
  return useContext(VaultModalContext)
}

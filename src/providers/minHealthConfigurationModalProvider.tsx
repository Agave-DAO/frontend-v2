import { PropsWithChildren, createContext, useContext, useState } from 'react'

import { MinHealthConfigurationModal } from '@/src/pagePartials/markets/modals/MinHealthConfigurationModal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MinHealthConfigurationModalContext = createContext({} as any)

const MinHealthConfigurationModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showMinHealthConfiguration, setShowMinHealthConfiguration] = useState<boolean | null>(null)
  const closeModal = () => setShowMinHealthConfiguration(null)

  const values = {
    isOpen: showMinHealthConfiguration,
    closeModal,
    openMinHealthConfigurationModal: () => setShowMinHealthConfiguration(true),
  }

  return (
    <MinHealthConfigurationModalContext.Provider value={values}>
      {children}
      {showMinHealthConfiguration && (
        <MinHealthConfigurationModal onClose={() => setShowMinHealthConfiguration(false)} />
      )}
    </MinHealthConfigurationModalContext.Provider>
  )
}

export default MinHealthConfigurationModalProvider

export const useMinHealthConfigurationModalContext = () => {
  return useContext(MinHealthConfigurationModalContext)
}

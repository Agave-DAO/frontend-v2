import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

import { getUserHealthFactorAlerts } from '@/src/apis/healthFactorAlerts'
import { BorrowRepayModal, DepositWithdrawModal } from '@/src/components/modals/ActionsModal'
import { HealthFactorAlertsModal } from '@/src/components/modals/HealthFactorAlertsModal'
import { MinHealthConfigurationModal } from '@/src/components/modals/MinHealthConfigurationModal'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useTokenInfo } from '@/src/hooks/useTokenInfo'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { BorrowRepayTabs, DepositWithdrawTabs, Modals } from '@/types/modal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ModalsContext = createContext({} as any)

const ModalsContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<{
    activeTab?: DepositWithdrawTabs | BorrowRepayTabs
    modalName: Modals
    mode?: InterestRateMode
    tokenAddress: string
  } | null>(null)
  const bodyDiv = document.getElementById('body') as HTMLElement
  const token = useTokenInfo(currentModal?.tokenAddress)

  const openModalClass = 'modalOpen'
  const [showMinHealthConfiguration, setShowMinHealthConfiguration] = useState<boolean | null>(null)
  const someModalIsOpen = currentModal || showMinHealthConfiguration
  const { address } = useWeb3Connection()
  const [isHFAlertEnabled, setIsHFAlertEnabled] = useState(false)
  const [HFAlertEmail, setHFAlertEmail] = useState('')
  const [HFAlertThreshold, setHFAlertThreshold] = useState(0)
  const [isHFAlertAgentListed, setisHFAlertAgentListed] = useState(false)
  const [HFAlertId, setHFAlertId] = useState(0)
  const [isHFAlertFetchError, setIsHFAlertFetchError] = useState(false)

  useEffect(() => {
    const fetchUserAlerts = async () => {
      if (address) {
        try {
          const userHealthFactorAlerts = await getUserHealthFactorAlerts(address)
          if (userHealthFactorAlerts) {
            setIsHFAlertEnabled(userHealthFactorAlerts.isReminderEnabled)
            setIsHFAlertFetchError(false)
          } else {
            setIsHFAlertFetchError(true)
          }
        } catch (e) {
          setIsHFAlertFetchError(true)
        }
      }
    }
    fetchUserAlerts()
  }, [address])

  const closeModal = () => setCurrentModal(null)

  useEffect(() => {
    if (someModalIsOpen && bodyDiv) {
      bodyDiv.classList.add(openModalClass)
    } else if (!someModalIsOpen && bodyDiv) {
      bodyDiv.classList.remove(openModalClass)
    }
  }, [bodyDiv, someModalIsOpen])

  const openDepositWithdrawModal = ({
    activeTab,
    tokenAddress,
  }: {
    tokenAddress: string
    activeTab?: DepositWithdrawTabs
  }) => {
    setCurrentModal({
      modalName: 'depositWithdraw',
      tokenAddress,
      activeTab,
    })
  }

  const openBorrowRepayModal = ({
    activeTab,
    mode,
    tokenAddress,
  }: {
    activeTab?: BorrowRepayTabs
    mode?: InterestRateMode
    tokenAddress: string
  }) => {
    setCurrentModal({
      activeTab,
      modalName: 'borrowRepay',
      mode,
      tokenAddress,
    })
  }

  const openHealthFactorAlertsModal = () => {
    setCurrentModal({
      activeTab: undefined,
      tokenAddress: '',
      modalName: 'healthFactorAlerts',
    })
  }

  const values = {
    closeModal,
    currentModal,
    openBorrowRepayModal,
    openDepositWithdrawModal,
    openMinHealthConfigurationModal: () => setShowMinHealthConfiguration(true),
    openHealthFactorAlertsModal,
    isHFAlertEnabled,
    setIsHFAlertEnabled,
    HFAlertEmail,
    setHFAlertEmail,
    HFAlertThreshold,
    setHFAlertThreshold,
    isHFAlertAgentListed,
    setisHFAlertAgentListed,
    HFAlertId,
    setHFAlertId,
    isHFAlertFetchError,
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
          mode={currentModal?.mode ?? InterestRateMode.variable}
          onClose={closeModal}
          token={token}
        />
      )}
      {showMinHealthConfiguration && (
        <MinHealthConfigurationModal onClose={() => setShowMinHealthConfiguration(false)} />
      )}
      {currentModal?.modalName === 'healthFactorAlerts' && (
        <HealthFactorAlertsModal onClose={closeModal} />
      )}
    </ModalsContext.Provider>
  )
}

export default ModalsContextProvider

export const useModalsContext = () => {
  return useContext(ModalsContext)
}

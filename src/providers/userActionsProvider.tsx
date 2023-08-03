import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { UserHealthFactorAlerts } from '@/types/user'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserActionsContext = createContext({} as any)

interface UserActionProviderProps {
  children: ReactNode
}

export const UserActionsProvider: React.FC<UserActionProviderProps> = ({ children }) => {
  const [viewHFAlertsSignature, setViewHFAlertsSignature] = useState<string | null>(null)
  const [viewHFAlertsUser, setViewHFAlertsUser] = useState<string | null>(null)
  const [viewHFAlertsAccessGranted, setViewHFAlertsAccessGranted] = useState(false)
  const [alertsData, setAlertsData] = useState<UserHealthFactorAlerts | null>(null)

  return (
    <UserActionsContext.Provider
      value={{
        alertsData,
        setAlertsData,
        setViewHFAlertsAccessGranted,
        setViewHFAlertsSignature,
        setViewHFAlertsUser,
        viewHFAlertsAccessGranted,
        viewHFAlertsSignature,
        viewHFAlertsUser,
      }}
    >
      {children}
    </UserActionsContext.Provider>
  )
}

export default UserActionsProvider

export function useUserActionsContext() {
  return useContext(UserActionsContext)
}

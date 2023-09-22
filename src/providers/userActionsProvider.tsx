import { ReactNode, createContext, useContext, useState } from 'react'

import { UserHealthFactorAlerts } from '@/types/user'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserActionsContext = createContext({} as any)

interface UserActionProviderProps {
  children: ReactNode
}

export const UserActionsProvider: React.FC<UserActionProviderProps> = ({ children }) => {
  const [unlimitedApproval, setUnlimitedApproval] = useState(false)
  const [viewHFAlertsSignature, setViewHFAlertsSignature] = useState<string | null>(null)
  const [viewHFAlertsUser, setViewHFAlertsUser] = useState<string | null>(null)
  const [alertsData, setAlertsData] = useState<UserHealthFactorAlerts | null>(null)

  return (
    <UserActionsContext.Provider
      value={{
        setUnlimitedApproval,
        unlimitedApproval,
        alertsData,
        setAlertsData,
        setViewHFAlertsSignature,
        setViewHFAlertsUser,
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

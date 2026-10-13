import { ReactNode, createContext, useContext, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserActionsContext = createContext({} as any)

interface UserActionProviderProps {
  children: ReactNode
}

export const UserActionsProvider: React.FC<UserActionProviderProps> = ({ children }) => {
  const [unlimitedApproval, setUnlimitedApproval] = useState(false)

  return (
    <UserActionsContext.Provider
      value={{
        setUnlimitedApproval,
        unlimitedApproval,
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

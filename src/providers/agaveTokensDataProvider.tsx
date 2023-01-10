import React, { ReactNode, createContext, useContext } from 'react'

import { AgaveTokensData, useAgaveTokensData } from '../hooks/agave/useAgaveTokensData'
import { Token } from '@/types/token'

// Initial state
export const AgaveTokensDataContext = createContext<AgaveTokensData>({} as AgaveTokensData)

/**
 * Takes a list of tokens and returns a React context provider that provides the data
 * @param  - `children` - the React component that will be rendered
 * @param  - `tokens` - list of AgaveReserveTokens (Token[])
 */
function AgaveTokensDataProvider({ children, tokens }: { children: ReactNode; tokens: Token[] }) {
  const { agaveTokensData } = useAgaveTokensData(tokens)

  return (
    <AgaveTokensDataContext.Provider value={agaveTokensData!}>
      {children}
    </AgaveTokensDataContext.Provider>
  )
}

function useAgaveTokensDataContext() {
  const context = useContext(AgaveTokensDataContext)
  if (context === undefined) {
    throw new Error('useAgaveTokensDataContext must be used within a AgaveTokensDataProvider')
  }
  return context
}

export { AgaveTokensDataProvider, useAgaveTokensDataContext }

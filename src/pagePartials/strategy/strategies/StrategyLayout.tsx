import { ReactNode } from 'react'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import VaultModalProvider from '@/src/providers/vaultModalProvider'

type LayoutProps = {
  children: ReactNode
}

export default function StrategyLayout({ children }: LayoutProps) {
  return (
    <>
      <RequiredConnection>
        <VaultModalProvider>{children}</VaultModalProvider>
      </RequiredConnection>
    </>
  )
}

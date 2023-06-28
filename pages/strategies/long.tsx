import { NextPage } from 'next'

import { LongContent } from '@/src/pagePartials/strategy/strategies/long/LongContent'
import VaultModalProvider from '@/src/providers/vaultModalProvider'

const Long: NextPage = () => {
  return (
    <VaultModalProvider>
      <LongContent />
    </VaultModalProvider>
  )
}

export default Long

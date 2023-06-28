import { NextPage } from 'next'

import { ShortContent } from '@/src/pagePartials/strategy/strategies/short/ShortContent'
import VaultModalProvider from '@/src/providers/vaultModalProvider'

const Short: NextPage = () => {
  return (
    <VaultModalProvider>
      <ShortContent />
    </VaultModalProvider>
  )
}

export default Short

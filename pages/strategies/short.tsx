import { NextPage } from 'next'

import { LongShortContent } from '@/src/pagePartials/strategy/strategies/longShort/LongShortContent'
import VaultModalProvider from '@/src/providers/vaultModalProvider'

const Short: NextPage = () => {
  return (
    <VaultModalProvider>
      <LongShortContent type="short" />
    </VaultModalProvider>
  )
}

export default Short

import { NextPage } from 'next'

import { LongShortContent } from '@/src/pagePartials/strategy/strategies/longShort/LongShortContent'
import VaultModalProvider from '@/src/providers/vaultModalProvider'

const Long: NextPage = () => {
  return (
    <VaultModalProvider>
      <LongShortContent type="long" />
    </VaultModalProvider>
  )
}

export default Long

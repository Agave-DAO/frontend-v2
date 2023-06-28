import { NextPage } from 'next'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { CollateralSwapContent } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapContent'
import { CollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import VaultModalProvider from '@/src/providers/vaultModalProvider'

const CollateralSwap: NextPage = () => {
  return (
    <RequiredConnection>
      <VaultModalProvider>
        <CollateralSwapStore>
          <CollateralSwapContent />
        </CollateralSwapStore>
      </VaultModalProvider>
    </RequiredConnection>
  )
}

export default CollateralSwap

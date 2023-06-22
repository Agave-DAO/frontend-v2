import { NextPage } from 'next'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { CollateralSwapContent } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapContent'
import { CollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'

const CollateralSwap: NextPage = () => {
  return (
    <RequiredConnection>
      <CollateralSwapStore>
        <CollateralSwapContent />
      </CollateralSwapStore>
    </RequiredConnection>
  )
}

export default CollateralSwap

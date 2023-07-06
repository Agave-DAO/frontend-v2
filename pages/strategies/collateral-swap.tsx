import { NextPage } from 'next'

import StrategyLayout from '@/src/pagePartials/strategy/strategies/StrategyLayout'
import { CollateralSwapContent } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapContent'
import { CollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'

const CollateralSwap: NextPage = () => {
  return (
    <StrategyLayout>
      <CollateralSwapStore>
        <CollateralSwapContent />
      </CollateralSwapStore>
    </StrategyLayout>
  )
}

export default CollateralSwap

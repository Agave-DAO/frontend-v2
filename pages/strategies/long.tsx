import { NextPage } from 'next'

import StrategyLayout from '@/src/pagePartials/strategy/strategies/StrategyLayout'
import { LongShortContent } from '@/src/pagePartials/strategy/strategies/longShort/LongShortContent'
import VaultModalProvider from '@/src/providers/vaultModalProvider'

const Long: NextPage = () => {
  return (
    <StrategyLayout>
      <LongShortContent type="long" />
    </StrategyLayout>
  )
}

export default Long

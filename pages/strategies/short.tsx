import { NextPage } from 'next'

import StrategyLayout from '@/src/pagePartials/strategy/strategies/StrategyLayout'
import { LongShortContent } from '@/src/pagePartials/strategy/strategies/longShort/LongShortContent'

const Short: NextPage = () => {
  return (
    <StrategyLayout>
      <LongShortContent type="short" />
    </StrategyLayout>
  )
}

export default Short

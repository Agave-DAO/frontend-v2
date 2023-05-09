import { NextPage } from 'next'

// Added ts-ignore because the IDE is complaining about the import
// yarn lint is not complaining about it
// These comments will be deleted when the strategies are created
// @ts-ignore
import { StrategyNameContent } from '@/src/pagePartials/strategy/strategies/strategyName/StrategyNameContent'

const StrategyName: NextPage = () => {
  return <StrategyNameContent />
}

export default StrategyName

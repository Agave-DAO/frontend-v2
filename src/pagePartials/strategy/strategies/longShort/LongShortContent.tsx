import { StrategyContainer } from '@/src/pagePartials/strategy/strategies/StrategyContainer'
import { LongShortForm } from '@/src/pagePartials/strategy/strategies/longShort/LongShortForm'

export const LongShortContent = ({ type }: { type: string }) => {
  return (
    <StrategyContainer strategy={type}>
      <LongShortForm type={type} />
    </StrategyContainer>
  )
}

import { useStrategyName } from './hooks/useStrategyName'
import { BaseTitle } from '@/src/components/text/BaseTitle'

export const StrategyNameContent = () => {
  const {
    data: { name, vaultAddress },
  } = useStrategyName()

  return (
    <div>
      <BaseTitle>{name}</BaseTitle>
      <p>Vault Address: {vaultAddress}</p>
    </div>
  )
}

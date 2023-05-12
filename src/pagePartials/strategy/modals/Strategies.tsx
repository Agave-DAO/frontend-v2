import { useEffect, useState } from 'react'

import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { CollateralSwap } from '@/src/pagePartials/strategy/modals/CollateralSwap'
import { StrategiesDropdown } from '@/src/pagePartials/strategy/modals/common/StrategiesDropdown'
import { Strategy } from '@/types/strategy'

interface Props extends ModalProps {
  currentStrategy: Strategy
}

export const Strategies: React.FC<Props> = ({ currentStrategy, onClose, ...restProps }) => {
  const [strategy, setStrategy] = useState<Strategy>(currentStrategy)

  useEffect(() => {
    setStrategy(currentStrategy)
  }, [currentStrategy])

  const onChange = (strategy: Strategy) => {
    setStrategy(strategy)
    console.log('strategy', strategy)
  }

  return (
    <Modal onClose={onClose} {...restProps}>
      <StrategiesDropdown onChange={onChange} strategy={strategy} />
      {strategy === 'collateralSwap' && <CollateralSwap />}
      {strategy === 'long' && <>Long component</>}
      {strategy === 'short' && <>Short component</>}
    </Modal>
  )
}

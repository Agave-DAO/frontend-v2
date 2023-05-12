import { useEffect, useState } from 'react'

import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { CollateralSwap } from '@/src/pagePartials/strategy/modals/CollateralSwap'
import { Strategy } from '@/types/strategy'

interface Props extends ModalProps {
  currentStrategy: Strategy
}

export const Strategies: React.FC<Props> = ({ currentStrategy, onClose, ...restProps }) => {
  const [strategy, setStrategy] = useState<Strategy>(currentStrategy)

  useEffect(() => {
    setStrategy(currentStrategy)
  }, [currentStrategy])

  return (
    <Modal onClose={onClose} {...restProps}>
      <div>Dropdown {strategy}</div>
      {strategy === 'collateralSwap' && <CollateralSwap />}
      {strategy === 'long' && <>Long component</>}
      {strategy === 'short' && <>Short component</>}
    </Modal>
  )
}

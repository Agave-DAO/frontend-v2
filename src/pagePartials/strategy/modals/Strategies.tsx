import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { CollateralSwap } from '@/src/pagePartials/strategy/modals/CollateralSwap'
import { LongShort } from '@/src/pagePartials/strategy/modals/LongShort'
import { StrategiesDropdown } from '@/src/pagePartials/strategy/modals/common/StrategiesDropdown'
import { Strategy } from '@/types/strategy'

const Title = styled(BaseTitle)`
  font-size: 2.4rem;
  margin: 0 0 32px;
`

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
      <Title>Strategies</Title>
      <StrategiesDropdown onChange={onChange} strategy={strategy} />
      {strategy === 'collateralSwap' && <CollateralSwap />}
      {strategy === 'long' && <LongShort type={'long'} />}
      {strategy === 'short' && <LongShort type={'short'} />}
    </Modal>
  )
}

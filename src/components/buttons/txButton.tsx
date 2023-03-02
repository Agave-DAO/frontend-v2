import { ButtonHTMLAttributes, useCallback } from 'react'
import styled from 'styled-components'

import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts'

import { ButtonCSS, ButtonPrimaryCSS } from '@/src/components/buttons/Button'
import useTransaction from '@/src/hooks/useTransaction'

interface TxButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onFail?: (error: unknown) => void
  onMined?: (r: ContractReceipt) => void
  onSend?: (t: ContractTransaction) => void
  tx: () => Promise<ContractTransaction>
}

const TxButton: React.FC<TxButtonProps> = ({
  children,
  onFail,
  onMined,
  onSend,
  tx,
  ...restProps
}) => {
  const sendTx = useTransaction()

  const txHandler = useCallback(async () => {
    try {
      const transaction = await sendTx(tx)
      onSend && onSend(transaction)
      if (onMined) {
        const receipt = await transaction.wait()
        onMined(receipt)
      }
    } catch (error) {
      onFail && onFail(error)
    }
  }, [onFail, onMined, onSend, sendTx, tx])

  return (
    <button onClick={txHandler} type="button" {...restProps}>
      {children}
    </button>
  )
}

export const TxButtonStyled = styled(TxButton)`
  ${ButtonCSS}
  ${ButtonPrimaryCSS}
`

TxButtonStyled.defaultProps = {
  borderRadiusVariant: 'fullyRounded',
  type: 'button',
}

export default TxButton

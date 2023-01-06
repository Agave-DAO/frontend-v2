import React, { ButtonHTMLAttributes, useCallback } from 'react'

import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import useTransaction from '@/src/hooks/useTransaction'

interface TxButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onMined?: (r: ContractReceipt) => void
  onSend?: (t: ContractTransaction) => void
  onFail?: (error: unknown) => void
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
    <ButtonPrimary onClick={txHandler} {...restProps}>
      {children}
    </ButtonPrimary>
  )
}

export default TxButton

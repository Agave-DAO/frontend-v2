import { ButtonHTMLAttributes, useCallback } from 'react'
import styled from 'styled-components'

import { ContractReceipt, ContractTransaction } from '@ethersproject/contracts'

import { ButtonCSS, ButtonProps, buttonVariantCSS } from '@/src/components/buttons/Button'
import useTransaction from '@/src/hooks/useTransaction'

const Button = styled.button<{ borderRadiusVariant?: ButtonProps }>``

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
    <Button onClick={txHandler} type="button" {...restProps}>
      {children}
    </Button>
  )
}

export const TxButtonStyled = styled(TxButton)`
  ${ButtonCSS}
  ${({ theme: { buttonPrimary } }) => buttonVariantCSS(buttonPrimary)}
`

TxButtonStyled.defaultProps = {
  borderRadiusVariant: 'fullyRounded',
  type: 'button',
}

export default TxButton

import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'

interface Props extends ModalProps {
  address?: string
}

export const VaultModal: React.FC<Props> = ({ address, ...restProps }) => {
  return (
    <Modal {...restProps}>
      <RequiredConnection>
        <>
          Create Vault
          {address}
        </>
      </RequiredConnection>
    </Modal>
  )
}

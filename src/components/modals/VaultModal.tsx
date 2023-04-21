import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Title as BaseTitle } from '@/src/components/common/StepAuxiliaryAction'
import { Button, ButtonWrapper, StepsCard } from '@/src/components/common/StepsCard'
import { Textfield } from '@/src/components/form/Textfield'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'

const LeftPadding = css`
  padding-left: 16px;
`

const Title = styled(BaseTitle)`
  ${LeftPadding}
  margin-bottom: 24px;
`

const Label = styled.p`
  ${LeftPadding}
  color: ${({ theme: { colors } }) => colors.darkestGray};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 16px;
`

const Buttons = styled(ButtonWrapper)`
  padding: 24px 0 0 0;
`

interface Props extends ModalProps {
  vaultAddress?: string
}

export const VaultModal: React.FC<Props> = ({ vaultAddress, ...restProps }) => {
  const editVault = useMemo(() => vaultAddress, [vaultAddress])

  return (
    <Modal {...restProps}>
      <RequiredConnection>
        <>
          {editVault && <>Edit stuff</>}
          <StepsCard>
            <Title>{editVault ? 'Rename vault' : 'Create new vault'}</Title>
            <Label>Name</Label>
            <Textfield value={editVault ? vaultAddress : ''} variant="light" />
            <Buttons>{editVault ? <Button>Rename</Button> : <Button>Create</Button>}</Buttons>
          </StepsCard>
        </>
      </RequiredConnection>
    </Modal>
  )
}

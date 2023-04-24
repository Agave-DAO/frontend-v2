import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Button, ButtonWrapper, StepsCard } from '@/src/components/card/StepsCard'
import { Textfield } from '@/src/components/form/Textfield'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { Title as BaseFormTitle } from '@/src/components/step/StepAuxiliaryAction'
import { BaseTitle } from '@/src/components/text/BaseTitle'

const Title = styled(BaseTitle)`
  margin: 0 0 32px;
`

const Empty = styled(EmptyContent)`
  margin-bottom: 32px;
  width: 100%;

  .alert {
    display: none;
  }
`

const LeftPadding = css`
  padding-left: 16px;
`

const FormTitle = styled(BaseFormTitle)`
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
          <Title>{editVault ? 'Edit vault name' : 'New vault'}</Title>
          {editVault ? (
            <>Edit stuff</>
          ) : (
            <Empty
              text={
                <>
                  A vault can receive cryptocurrency like a normal asset balance in your account.
                  Deposit collateral and borrow your future yield.
                  <br />
                  <br />
                  <ActionButton
                    onClick={() =>
                      window.open(
                        'https://agavedev.notion.site/agavedev/Agave-Docs-a0cb462422b941d89a6dc646cdb1bdf8',
                        '_blank',
                      )
                    }
                    variant="darker"
                  >
                    Learn more
                  </ActionButton>
                </>
              }
              title="Information"
            />
          )}
          <StepsCard>
            <FormTitle>{editVault ? 'Rename vault' : 'Create new vault'}</FormTitle>
            <Label>Name</Label>
            <Textfield value={editVault ? vaultAddress : ''} variant="light" />
            <Buttons>{editVault ? <Button>Rename</Button> : <Button>Create</Button>}</Buttons>
          </StepsCard>
        </>
      </RequiredConnection>
    </Modal>
  )
}

import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { EmphasizedRowValue, Row, RowKey, Rows } from '@/src/components/common/Rows'
import { Textfield } from '@/src/components/form/Textfield'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { Title as BaseFormTitle } from '@/src/components/step/StepAuxiliaryAction'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'

const Title = styled(BaseTitle)`
  margin: 0 0 32px;
`

const Info = styled(EmptyContent)`
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

export const VaultModal: React.FC<Props> = ({ onClose, vaultAddress, ...restProps }) => {
  const editVault = useMemo(() => (vaultAddress !== undefined ? true : false), [vaultAddress])
  const [vaultName, setVaultName] = useState<string>('')
  const tokenSymbol = 'usdc'
  const tokenIcon = <TokenIcon dimensions={18} symbol={tokenSymbol} />

  useEffect(() => {
    if (editVault) {
      setVaultName('My vault')
    }
  }, [editVault])

  const saveAndClose = () => {
    onClose()
  }

  return (
    <Modal onClose={onClose} {...restProps}>
      <RequiredConnection>
        <>
          <Title>{editVault ? 'Edit vault name' : 'New vault'}</Title>
          {editVault ? (
            <Info
              text={
                <Rows>
                  <Row variant="dark">
                    <RowKey>Your Vault balance</RowKey>
                    <EmphasizedRowValue>
                      {tokenIcon}
                      1,000.00
                    </EmphasizedRowValue>
                  </Row>
                  <Row>
                    <RowKey>Value locked</RowKey>
                    <EmphasizedRowValue>
                      {tokenIcon}
                      100.00
                    </EmphasizedRowValue>
                  </Row>
                </Rows>
              }
              title="Vault information"
            />
          ) : (
            <Info
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
          <FormCard>
            <FormTitle>{editVault ? 'Rename vault' : 'Create new vault'}</FormTitle>
            <Label>Name</Label>
            <Textfield
              onChange={(e) => setVaultName(e.currentTarget.value)}
              value={vaultName}
              variant="light"
            />
            <Buttons>
              <Button onClick={saveAndClose}>{editVault ? 'Rename' : 'Create'}</Button>
            </Buttons>
          </FormCard>
        </>
      </RequiredConnection>
    </Modal>
  )
}

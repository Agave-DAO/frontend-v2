import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { Title as BaseFormTitle } from '@/src/components/common/TitleWithAction'
import { Formfield } from '@/src/components/form/Formfield'
import { Textfield, TextfieldStatus } from '@/src/components/form/Textfield'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useVaults } from '@/src/hooks/presentation/useVaults'
import { VaultInfo } from '@/src/pagePartials/strategy/vaults/VaultInfo'

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
  padding: var(--padding-xl) 0 0 0;
`

interface Props extends ModalProps {
  vaultAddress?: string
}

const MIN_VAULT_NAME_LENGTH = 3
const MAX_VAULT_NAME_LENGTH = 30

const VaultModal: React.FC<Props> = ({ onClose, vaultAddress, ...restProps }) => {
  const editVault = useMemo(() => (vaultAddress !== undefined ? true : false), [vaultAddress])
  const { createVault, refetchUserVaults, vaultNameExists } = useVaults()
  const [vaultName, setVaultName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const saveAndClose = async () => {
    if (vaultName) {
      setLoading(true)
      const vault = await createVault(vaultName)
      setLoading(false)
      if (vault) {
        await refetchUserVaults()
        setVaultName('')
        onClose()
      }
    }
  }

  const error = useMemo(() => {
    if (vaultName.length < MIN_VAULT_NAME_LENGTH) {
      return 'Vault name must be at least 3 characters'
    }
    if (vaultName.length > MAX_VAULT_NAME_LENGTH) {
      return 'Vault name must be less than 30 characters'
    }
    if (vaultNameExists(vaultName)) {
      return 'Vault name already exists'
    }
  }, [vaultName, vaultNameExists])

  const disableSubmit = useMemo(() => !vaultName || loading || !!error, [vaultName, loading, error])

  return (
    <Modal onClose={onClose} {...restProps}>
      <>
        <Title>{editVault ? 'Edit vault name' : 'New vault'}</Title>
        {editVault ? (
          <Info text={<VaultInfo />} title="Vault information" />
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
          <Formfield
            formControl={
              <Textfield
                onChange={(e) => setVaultName(e.currentTarget.value)}
                value={vaultName}
                variant="light"
              />
            }
            status={vaultName && error ? TextfieldStatus.error : undefined}
            statusText={error}
          />

          <Buttons>
            <Button disabled={disableSubmit} onClick={saveAndClose}>
              {editVault ? 'Rename' : 'Create'}
            </Button>
          </Buttons>
        </FormCard>
      </>
    </Modal>
  )
}

export default withGenericSuspense(VaultModal, () => null) // avoid loading in hidden element

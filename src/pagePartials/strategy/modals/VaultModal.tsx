import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { Title as BaseFormTitle } from '@/src/components/common/TitleWithAction'
import { Formfield } from '@/src/components/form/Formfield'
import { Textfield, TextfieldStatus } from '@/src/components/form/Textfield'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useCreateNewVault } from '@/src/hooks/mutations/useCreateNewVault'
import { useEditVaultName } from '@/src/hooks/mutations/useEditVaultName'
import { useVaults } from '@/src/hooks/presentation/useVaults'
import { VaultInfo } from '@/src/pagePartials/strategy/vaults/VaultInfo'

const Title = styled(BaseTitle)`
  font-size: 2.4rem;
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
  vaultName?: string
}

const MIN_VAULT_NAME_LENGTH = 3
const MAX_VAULT_NAME_LENGTH = 30

const EditButtonAction = ({
  disableSubmit,
  onClose,
  setLoading,
  setVaultName,
  vaultAddress,
  vaultName,
}: {
  vaultAddress: string
  vaultName: string
  disableSubmit: boolean
  setVaultName: (value: string) => void
  onClose: () => void
  setLoading: (value: boolean) => void
}) => {
  const { refetchUserVaults } = useVaults()
  const editVaultName = useEditVaultName(vaultAddress)

  const editAndClose = async () => {
    if (!disableSubmit) {
      setLoading(true)
      const vault = await editVaultName(vaultName)
      if (vault) {
        await refetchUserVaults()
        setVaultName('')
        setLoading(false)
        onClose()
      }
    }
  }

  return (
    <Button disabled={disableSubmit} onClick={editAndClose}>
      Rename
    </Button>
  )
}

const VaultModal: React.FC<Props> = ({ onClose, vaultAddress, vaultName, ...restProps }) => {
  const editVault = useMemo(() => (vaultAddress !== undefined ? true : false), [vaultAddress])
  const { refetchUserVaults, vaultNameExists } = useVaults()
  const createVault = useCreateNewVault()
  const [vaultNameEdited, setVaultName] = useState<string>(vaultName || '')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (vaultName && !vaultNameEdited) {
      setVaultName(vaultName)
    }
  }, [vaultName, vaultNameEdited])

  const saveAndClose = async () => {
    if (vaultNameEdited && vaultNameEdited !== vaultName) {
      setLoading(true)
      const vault = await createVault(vaultNameEdited)
      if (vault) {
        await refetchUserVaults()
        setVaultName('')
        setLoading(false)
        onClose()
      }
    }
  }

  const error = useMemo(() => {
    if (vaultNameEdited.length < MIN_VAULT_NAME_LENGTH) {
      return 'Vault name must be at least 3 characters'
    }
    if (vaultNameEdited.length > MAX_VAULT_NAME_LENGTH) {
      return 'Vault name must be less than 30 characters'
    }
    if (vaultNameExists(vaultNameEdited) && vaultNameEdited !== vaultName) {
      return 'Vault name already exists'
    }
  }, [vaultName, vaultNameEdited, vaultNameExists])

  const disableSubmit = useMemo(
    () => !vaultNameEdited || loading || !!error || (editVault && vaultNameEdited === vaultName),
    [vaultNameEdited, loading, error, editVault, vaultName],
  )

  return (
    <Modal onClose={onClose} {...restProps}>
      <Title>{editVault ? 'Edit vault name' : 'New vault'}</Title>
      {editVault ? (
        <Info text={<VaultInfo vaultAddress={''} />} title="Vault information" />
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
              value={vaultNameEdited}
              variant="light"
            />
          }
          status={vaultName && error ? TextfieldStatus.error : undefined}
          statusText={error}
        />

        <Buttons>
          {/* Edit vault button */}
          {editVault && vaultAddress && vaultNameEdited && (
            <EditButtonAction
              disableSubmit={disableSubmit}
              onClose={onClose}
              setLoading={setLoading}
              setVaultName={setVaultName}
              vaultAddress={vaultAddress}
              vaultName={vaultNameEdited}
            />
          )}
          {/* Create vault button */}
          {!editVault && (
            <Button disabled={disableSubmit} onClick={saveAndClose}>
              Create
            </Button>
          )}
        </Buttons>
      </FormCard>
    </Modal>
  )
}

export default withGenericSuspense(VaultModal, ({ onClose, ...restProps }) => (
  <Modal onClose={onClose} {...restProps}>
    <SkeletonLoading style={{ height: '30px', marginBottom: '32px' }} />
    <SkeletonLoading
      style={{
        alignItems: 'center',
        borderRadius: '16px',
        columnGap: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '220px',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '16px',
      }}
    >
      {Array.from({ length: 4 }).map((item, index) => (
        <SkeletonLoading animate={false} key={index} style={{ height: '35px' }} />
      ))}
    </SkeletonLoading>
    <SkeletonLoading
      style={{
        alignItems: 'center',
        borderRadius: '16px',
        columnGap: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '250px',
        justifyContent: 'space-between',
        padding: '16px',
      }}
    >
      {Array.from({ length: 4 }).map((item, index) => (
        <SkeletonLoading animate={false} key={index} style={{ height: '35px' }} />
      ))}
    </SkeletonLoading>
  </Modal>
)) // avoid loading in hidden element

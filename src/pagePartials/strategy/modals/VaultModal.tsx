import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { withGenericSuspense } from '../helpers/SafeSuspense'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { Title as BaseFormTitle } from '@/src/components/common/TitleWithAction'
import { Textfield } from '@/src/components/form/Textfield'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
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
  padding: 24px 0 0 0;
`

interface Props extends ModalProps {
  vaultAddress?: string
}

const VaultModal: React.FC<Props> = ({ onClose, vaultAddress, ...restProps }) => {
  const editVault = useMemo(() => (vaultAddress !== undefined ? true : false), [vaultAddress])
  const { createVault, refetchUserVaults } = useVaults()
  const [vaultName, setVaultName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const saveAndClose = async () => {
    if (vaultName) {
      setLoading(true)
      const vault = await createVault(vaultName)
      setLoading(false)
      if (vault) {
        refetchUserVaults()
        setVaultName('')
        onClose()
      }
    }
  }

  const disableSubmit = useMemo(
    () => !vaultName || loading || vaultName.length < 3,
    [vaultName, loading],
  )

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
          <Textfield
            onChange={(e) => setVaultName(e.currentTarget.value)}
            value={vaultName}
            variant="light"
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

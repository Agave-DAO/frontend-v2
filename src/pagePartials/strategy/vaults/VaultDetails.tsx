import styled from 'styled-components'

import vaultDetails from '@/pages/strategies/vault-details'
import { Asset, Body, Head } from '@/src/components/asset/Asset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { MoreActionsDropdown } from '@/src/components/dropdown/MoreActionsDropdown'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { VaultInfo } from '@/src/pagePartials/strategy/vaults/VaultInfo'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Wrapper = styled(Asset)`
  height: auto;
`

export const VaultDetails: React.FC<{ vaultAddress: string }> = ({
  vaultAddress,
  ...restProps
}) => {
  // this is obviously just a placeholder
  const { openCreateVaultModal, openDepositWithdrawModal } = useVaultModalContext()
  const items = [
    {
      text: 'Edit name',
      onClick: () => openCreateVaultModal(vaultDetails),
    },
    {
      text: 'Withdraw',
      onClick: () => openDepositWithdrawModal('withdraw'),
    },
  ]

  return (
    <Wrapper {...restProps}>
      <Head>
        <VaultInfo vaultAddress={vaultAddress} />
      </Head>
      <Body>
        <ActionsWrapper>
          <MoreActionsDropdown items={items} size="lg" />
          <ActionButton onClick={() => openDepositWithdrawModal('deposit')}>Deposit</ActionButton>
        </ActionsWrapper>
      </Body>
    </Wrapper>
  )
}

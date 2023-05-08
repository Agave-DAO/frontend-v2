import styled from 'styled-components'

import { Asset, Body, Head } from '@/src/components/asset/Asset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { MoreActionsDropdown } from '@/src/components/dropdown/MoreActionsDropdown'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { VaultInfo } from '@/src/pagePartials/strategy/vaults/VaultInfo'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Wrapper = styled(Asset)`
  height: auto;
`

export const VaultDetails: React.FC = ({ ...restProps }) => {
  // this is obviously just a placeholder
  const getStrategyAddress = '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'
  const { openCreateVaultModal, openDepositWithdrawModal } = useVaultModalContext()
  const items = [
    {
      text: 'Edit name',
      onClick: () => openCreateVaultModal(getStrategyAddress),
    },
    {
      text: 'Withdraw',
      onClick: () => openDepositWithdrawModal('withdraw'),
    },
  ]

  return (
    <Wrapper {...restProps}>
      <Head>
        <VaultInfo />
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

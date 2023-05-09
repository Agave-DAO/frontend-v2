import { NextPage } from 'next'
import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { VaultsList } from '@/src/pagePartials/strategy/vaults/VaultsList'
import VaultModalProvider, { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Title = styled(BaseTitle)`
  margin-top: 23px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-top: 0;
  }
`

const StrategiesImpl = withGenericSuspense(() => {
  const { openCreateVaultModal } = useVaultModalContext()

  return (
    <>
      <Title hasExtraControls>
        Strategies
        <ActionButton onClick={() => openCreateVaultModal()} variant="ultraLight">
          Create new vault
        </ActionButton>
      </Title>
      <VaultsList />
    </>
  )
})

const Strategies: NextPage = () => {
  return (
    <RequiredConnection>
      <VaultModalProvider>
        <StrategiesImpl />
      </VaultModalProvider>
    </RequiredConnection>
  )
}

export default Strategies

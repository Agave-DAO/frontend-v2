import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { List, ListNavigationItem } from '@/src/components/common/List'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useVaults } from '@/src/hooks/presentation/useVaults'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Wrapper = styled.div`
  display: grid;
  row-gap: 16px;
`

const Empty = styled(EmptyContent)`
  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    align-items: center;
    text-align: center;
  }
`

const DesktopBreakpoint = styled.br`
  display: none;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    display: block;
  }
`

const Buttons = styled.div`
  display: grid;
  row-gap: 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    column-gap: 24px;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    margin: 48px auto 0;
    max-width: fit-content;
  }
`

export const VaultsList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { vaultList: vaults } = useVaults()
    const { openCreateVaultModal } = useVaultModalContext()

    return vaults?.length ? (
      <Wrapper {...restProps}>
        <List>
          {vaults.map((vault, index) => (
            <ListNavigationItem
              // TODO: change to query param
              href={`/strategies/${vault.vaultAddress}`}
              key={index}
              title={`Vault ${vault.name}`}
            ></ListNavigationItem>
          ))}
        </List>
      </Wrapper>
    ) : (
      <Empty
        text={
          <>
            A vault can receive cryptocurrency like a normal asset balance in your account.{' '}
            <DesktopBreakpoint />
            Deposit collateral and borrow your future yield.
            <br />
            <br />
            <Buttons>
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
              <ActionButton
                onClick={() => {
                  openCreateVaultModal()
                }}
              >
                Create vault
              </ActionButton>
            </Buttons>
          </>
        }
        title="No vaults created yet"
      />
    )
  },
  ({ ...restProps }) => <div {...restProps}>VaultsList skeleton</div>,
)

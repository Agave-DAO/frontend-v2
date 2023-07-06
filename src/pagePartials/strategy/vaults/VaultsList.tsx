import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { List, ListNavigationItem } from '@/src/components/common/List'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
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
              href={`/strategies/vault-details?vault=${vault.vaultAddress}`}
              key={index}
              title={`${vault.name}`}
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
  ({ ...restProps }) => (
    <Wrapper {...restProps}>
      <List>
        {Array.from({ length: 6 }).map((item, index) => (
          <SkeletonLoading
            key={`list_${index}`}
            style={{
              alignItems: 'center',
              borderRadius: '16px',
              columnGap: '16px',
              display: 'flex',
              height: '88px',
              padding: '0 16px',
            }}
          >
            <SkeletonLoading animate={false} style={{ height: '22px' }} />
            <SkeletonLoading
              animate={false}
              style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                flexShrink: '0',
                minWidth: '0',
                minHeight: '0',
              }}
            />
          </SkeletonLoading>
        ))}
      </List>
    </Wrapper>
  ),
)

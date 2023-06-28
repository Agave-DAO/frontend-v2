import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { List } from '@/src/components/common/List'
import { GoToExplorer } from '@/src/components/helpers/GoToExplorer'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { strategiesInfo } from '@/src/constants/strategiesInfo'
import { useVaults } from '@/src/hooks/presentation/useVaults'
import { HistoryList } from '@/src/pagePartials/strategy/positions/HistoryList'
import { PositionsList } from '@/src/pagePartials/strategy/positions/PositionsList'
import { StrategyItem } from '@/src/pagePartials/strategy/strategies/StrategyItem'
import { VaultDetails as BaseVaultDetails } from '@/src/pagePartials/strategy/vaults/VaultDetails'
import VaultModalProvider, { useVaultModalContext } from '@/src/providers/vaultModalProvider'
import { isSameAddress } from '@/src/utils/isSameAddress'

const Tabs = styled(BaseTabs)`
  margin: 0 auto 32px auto;
`
const Title = styled(BaseTitle)`
  margin: 0 0 40px;
  text-transform: capitalize;
`

const VaultDetailsComponent = styled(BaseVaultDetails)`
  margin: 0 0 32px;
`

const NewStrategy = () => {
  const router = useRouter()
  const { vaultAddress } = useVaultModalContext()

  return (
    <>
      {strategiesInfo.map((strategy) => (
        <StrategyItem
          icon={strategy.icon}
          key={strategy.slug}
          onClick={() => router.push(`/strategies/${strategy.slug}?vault=${vaultAddress}`)}
          title={strategy.name}
          type={strategy.type}
        />
      ))}
    </>
  )
}

const VaultDetailsImpl = withGenericSuspense(
  () => {
    const { setVaultName, vaultAddress } = useVaultModalContext()

    const [tab, setTab] = useState<'new-strategy' | 'positions' | 'history'>('new-strategy')

    const { vaultList: vaults } = useVaults()
    const selectedVault = useMemo(
      () =>
        vaults?.find((vault) => vaultAddress && isSameAddress(vault.vaultAddress, vaultAddress)),
      [vaultAddress, vaults],
    )

    if (!selectedVault) {
      return (
        <Title hasExtraControls>
          <span>Vault not found</span>
        </Title>
      )
    }

    // set vault name in the vault modal context
    useEffect(() => {
      setVaultName(selectedVault.name)
    }, [selectedVault.name, setVaultName])

    return (
      <>
        <Title hasExtraControls>
          <span>
            Vault: <em>{selectedVault.name}</em>
          </span>
          <GoToExplorer address={selectedVault.vaultAddress} text="Vault" />
        </Title>
        <VaultDetailsComponent />
        <Tabs>
          <Tab isActive={tab === 'new-strategy'} onClick={() => setTab('new-strategy')}>
            New Strategy
          </Tab>
          <Tab isActive={tab === 'history'} onClick={() => setTab('history')}>
            History
          </Tab>
          <Tab isActive={tab === 'positions'} onClick={() => setTab('positions')}>
            Positions
          </Tab>
        </Tabs>
        {tab === 'new-strategy' && <NewStrategy />}
        {tab === 'history' && <HistoryList />}
        {tab === 'positions' && <PositionsList />}
      </>
    )
  },
  () => (
    <>
      <SkeletonLoading style={{ marginBottom: '40px', height: '30px' }} />
      <SkeletonLoading
        style={{
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '192px',
          justifyContent: 'space-between',
          marginBottom: '32px',
          padding: '16px',
        }}
      >
        {Array.from({ length: 3 }).map((item, index) => (
          <SkeletonLoading animate={false} key={index} style={{ height: '35px' }} />
        ))}
      </SkeletonLoading>
      <SkeletonLoading style={{ marginBottom: '16px', height: '20px' }} />
      <List>
        {Array.from({ length: 3 }).map((item, index) => (
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
            <SkeletonLoading animate={false} style={{ height: '22px' }} />
          </SkeletonLoading>
        ))}
      </List>
    </>
  ),
)

const VaultDetails: NextPage = () => {
  return (
    <RequiredConnection>
      <VaultModalProvider>
        <VaultDetailsImpl />
      </VaultModalProvider>
    </RequiredConnection>
  )
}

export default VaultDetails

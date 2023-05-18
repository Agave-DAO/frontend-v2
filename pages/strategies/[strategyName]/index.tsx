import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { List } from '@/src/components/common/List'
import { GoToExplorer } from '@/src/components/helpers/GoToExplorer'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { ButtonTab, ButtonTabs } from '@/src/components/tabs/ButtonTabs'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { HistoryList } from '@/src/pagePartials/strategy/positions/HistoryList'
import { PositionsList } from '@/src/pagePartials/strategy/positions/PositionsList'
import { CollateralSwap, Long, Short } from '@/src/pagePartials/strategy/strategies/StrategyItem'
import { VaultDetails as BaseVaultDetails } from '@/src/pagePartials/strategy/vaults/VaultDetails'
import VaultModalProvider, { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Title = styled(BaseTitle)`
  margin: 0 0 40px;
  text-transform: capitalize;
`

const VaultDetails = styled(BaseVaultDetails)`
  margin: 0 0 32px;
`

const SubTitle = styled(BaseTitle)`
  font-size: 1.6rem;
  margin: 0 0 16px;
`

const StrategyImpl = withGenericSuspense(
  () => {
    const router = useRouter()
    const { strategyName } = router.query
    const [positions, setPositions] = useState<Array<number>>([])
    // this is obviously just a placeholder
    const getStrategyAddress = '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'
    const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'newStrategy'>('positions')
    const showPositionsList = useMemo(() => activeTab === 'positions', [activeTab])
    const showHistoryList = useMemo(() => activeTab === 'history', [activeTab])
    const showNewStrategyList = useMemo(() => activeTab === 'newStrategy', [activeTab])
    const { openCollateralSwapModal, openLongModal, openShortModal } = useVaultModalContext()

    const tabs = useMemo(
      () => [
        {
          text: 'Positions',
          onClick: () => setActiveTab('positions'),
          isActive: showPositionsList,
        },
        {
          text: 'History',
          onClick: () => setActiveTab('history'),
          isActive: showHistoryList,
        },
        {
          text: 'New Strategy',
          onClick: () => setActiveTab('newStrategy'),
          isActive: showNewStrategyList,
        },
      ],
      [showHistoryList, showNewStrategyList, showPositionsList],
    )

    const createPosition = () => {
      // delete this after vault creation is implemented
      setTimeout(() => {
        setPositions([...positions, 0, 1, 2, 3, 4])
      }, 500)
    }

    const strategyCreationItems = (
      <List>
        <Long
          onClick={() => {
            openLongModal()
            createPosition()
          }}
        />
        <Short
          onClick={() => {
            openShortModal()
            createPosition()
          }}
        />
        <CollateralSwap
          onClick={() => {
            openCollateralSwapModal()
            createPosition()
          }}
        />
      </List>
    )

    return (
      <>
        <Title hasExtraControls>
          <span>Vault {strategyName}</span>
          <GoToExplorer address={getStrategyAddress} text="Vault" />
        </Title>
        <VaultDetails />
        {positions.length ? (
          <>
            <ButtonTabs>
              {tabs.map(({ isActive, onClick, text }, index) => (
                <ButtonTab isActive={isActive} key={`button_tab_${index}`} onClick={onClick}>
                  {text}
                </ButtonTab>
              ))}
            </ButtonTabs>
            {showPositionsList && <PositionsList />}
            {showHistoryList && <HistoryList />}
            {showNewStrategyList && <>{strategyCreationItems}</>}
          </>
        ) : (
          <>
            <SubTitle>Create Strategy</SubTitle>
            {strategyCreationItems}
          </>
        )}
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

const Strategy: NextPage = () => {
  return (
    <RequiredConnection>
      <VaultModalProvider>
        <StrategyImpl />
      </VaultModalProvider>
    </RequiredConnection>
  )
}

export default Strategy

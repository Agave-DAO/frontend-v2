import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { List } from '@/src/components/common/List'
import { GoToExplorer } from '@/src/components/helpers/GoToExplorer'
import { ButtonTab, ButtonTabs } from '@/src/components/tabs/ButtonTabs'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { PositionsList } from '@/src/pagePartials/strategy/positions/PositionsList'
import { CollateralSwap, Long, Short } from '@/src/pagePartials/strategy/strategies/StrategyItem'
import { VaultDetails as BaseVaultDetails } from '@/src/pagePartials/strategy/vaults/VaultDetails'

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

const Strategy: NextPage = () => {
  const router = useRouter()
  const { strategyName } = router.query
  const [positions, setPositions] = useState<Array<number>>([])
  // this is obviously just a placeholder
  const getStrategyAddress = '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'
  const [activeTab, setActiveTab] = useState<'positions' | 'history' | 'newStrategy'>('positions')
  const showPositionsList = useMemo(() => activeTab === 'positions', [activeTab])
  const showHistoryList = useMemo(() => activeTab === 'history', [activeTab])
  const showNewStrategyList = useMemo(() => activeTab === 'newStrategy', [activeTab])

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
      <Long onClick={() => createPosition()} />
      <Short onClick={() => createPosition()} />
      <CollateralSwap onClick={() => createPosition()} />
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
          {showHistoryList && <>History list</>}
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
}

export default Strategy

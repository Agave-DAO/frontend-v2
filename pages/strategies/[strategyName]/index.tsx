import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

import { Asset, Body, Head } from '@/src/components/asset/Asset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { List } from '@/src/components/common/List'
import { EmphasizedRowValue, Row, RowKey, Rows } from '@/src/components/common/Rows'
import { MoreActionsDropdown } from '@/src/components/dropdown/MoreActionsDropdown'
import { GoToExplorer } from '@/src/components/helpers/GoToExplorer'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { CollateralSwap, Long, Short } from '@/src/pagePartials/strategy/strategies/StrategyItem'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Title = styled(BaseTitle)`
  margin: 0 0 40px;
  text-transform: capitalize;
`

const VaultInfo = styled(Asset)`
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
  const { openCreateVaultModal } = useVaultModalContext()
  const items = [
    {
      text: 'Edit name',
      onClick: () => openCreateVaultModal(strategyName),
    },
    {
      text: 'Withdraw',
      onClick: () => console.log('withdraw'),
    },
  ]
  const tokenSymbol = 'usdc'
  const tokenIcon = <TokenIcon dimensions={18} symbol={tokenSymbol} />

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
      <VaultInfo>
        <Head>
          <Rows>
            <Row variant="dark">
              <RowKey>Your Vault balance</RowKey>
              <EmphasizedRowValue>
                {tokenIcon}
                1,000.00
              </EmphasizedRowValue>
            </Row>
            <Row>
              <RowKey>Value locked</RowKey>
              <EmphasizedRowValue>
                {tokenIcon}
                100.00
              </EmphasizedRowValue>
            </Row>
          </Rows>
        </Head>
        <Body>
          <ActionsWrapper>
            <MoreActionsDropdown items={items} size="lg" />
            <ActionButton onClick={() => console.log('Deposit')}>Deposit</ActionButton>
          </ActionsWrapper>
        </Body>
      </VaultInfo>
      {positions.length ? (
        <>
          <div>tabs</div>
          <div>tab 1</div>
          <div>tab 2</div>
          <div>{strategyCreationItems}</div>
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

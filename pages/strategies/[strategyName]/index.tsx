import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { List } from '@/src/components/common/List'
import { GoToExplorer } from '@/src/components/helpers/GoToExplorer'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { CollateralSwap, Long, Short } from '@/src/pagePartials/strategy/strategies/StrategyItem'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Title = styled(BaseTitle)`
  margin: 0 0 40px;
  text-transform: capitalize;
`

const Strategy: NextPage = () => {
  const router = useRouter()
  const { strategyName } = router.query
  // this is obviously just a placeholder
  const getStrategyAddress = '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'
  const { openCreateVaultModal } = useVaultModalContext()

  return (
    <>
      <Title hasExtraControls>
        <span>Vault {strategyName}</span>
        <GoToExplorer address={getStrategyAddress} text="Vault" />
      </Title>
      <p>
        <button onClick={() => openCreateVaultModal()}>Edit vault</button>
      </p>
      <List>
        <Long onClick={() => console.log('long')} />
        <Short onClick={() => console.log('short')} />
        <CollateralSwap onClick={() => console.log('collateral swap')} />
      </List>
    </>
  )
}

export default Strategy

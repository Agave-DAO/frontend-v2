import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { List } from '@/src/components/common/List'
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
  const { openCreateVaultModal } = useVaultModalContext()

  return (
    <>
      <Title hasExtraControls>
        <span>Vault {strategyName}</span>
        <a href="aasd">Vault</a>
      </Title>
      <p>
        <button onClick={() => openCreateVaultModal('0x12345678901234567890')}>Edit vault</button>
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

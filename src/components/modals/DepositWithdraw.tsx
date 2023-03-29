import { useState } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { DepositInfo } from '@/src/pagePartials/markets/DepositInfo'
import { Deposit } from '@/src/pagePartials/markets/deposit/Deposit'
import { Withdraw } from '@/src/pagePartials/markets/withdraw/Withdraw'
import { DepositWithdrawTabs } from '@/types/modal'
import { Token } from '@/types/token'

const Tabs = styled(BaseTabs)`
  margin: 32px auto;
`

interface Props {
  activeTab?: DepositWithdrawTabs
  onTokenSelect: (token: Token) => void
  token: Token | null
}

const DepositWithdrawBase: React.FC<Props> = ({ activeTab, onTokenSelect, token }) => {
  const [tab, setTab] = useState<DepositWithdrawTabs>(activeTab || 'deposit')
  const depositActive = tab === 'deposit'
  const withdrawActive = tab === 'withdraw'

  return token ? (
    <>
      <DepositInfo token={token} />
      <Tabs>
        <Tab isActive={tab === 'deposit'} onClick={() => setTab('deposit')}>
          Deposit
        </Tab>
        <Tab isActive={tab === 'withdraw'} onClick={() => setTab('withdraw')}>
          Withdraw
        </Tab>
      </Tabs>
      {depositActive && <Deposit onTokenSelect={onTokenSelect} tokenAddress={token.address} />}
      {withdrawActive && token && (
        <Withdraw onTokenSelect={onTokenSelect} tokenAddress={token.address} />
      )}
    </>
  ) : null
}

export const DepositWithdraw = withGenericSuspense(DepositWithdrawBase)

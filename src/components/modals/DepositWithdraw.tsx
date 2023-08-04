import { useState } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
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
  setTab: (tab: DepositWithdrawTabs) => void
  token: Token | null
}

export const DepositWithdraw: React.FC<Props> = withGenericSuspense(
  ({ activeTab, onTokenSelect, setTab, token }) => {
    const depositActive = activeTab === 'deposit'
    const withdrawActive = activeTab === 'withdraw'

    return token ? (
      <>
        <DepositInfo token={token} />
        <Tabs>
          <Tab isActive={depositActive} onClick={() => setTab('deposit')}>
            Deposit
          </Tab>
          <Tab isActive={withdrawActive} onClick={() => setTab('withdraw')}>
            Withdraw
          </Tab>
        </Tabs>
        {depositActive && <Deposit onTokenSelect={onTokenSelect} tokenAddress={token.address} />}
        {withdrawActive && token && (
          <Withdraw onTokenSelect={onTokenSelect} tokenAddress={token.address} />
        )}
      </>
    ) : null
  },
  () => (
    <>
      <SkeletonLoading style={{ height: '48px', margin: '0 0 44px' }} />
      <SkeletonLoading
        style={{
          borderRadius: '16px',
          padding: '16px',
        }}
      >
        <div style={{ display: 'grid', rowGap: '6px' }}>
          {Array.from({ length: 6 }).map((item, index) => (
            <SkeletonLoading
              animate={false}
              key={`list_${index}`}
              style={{ height: '53px', borderRadius: '6px' }}
            />
          ))}
        </div>
      </SkeletonLoading>
      <Tabs style={{ height: '89px', maxWidth: 'none', width: '244px' }} />
      <SkeletonLoading
        style={{
          borderRadius: '16px',
          height: '200px',
        }}
      />
    </>
  ),
)

import { useState } from 'react'
import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { BorrowInfo } from '@/src/pagePartials/markets/BorrowInfo'
import { RepayInfo } from '@/src/pagePartials/markets/RepayInfo'
import { Borrow } from '@/src/pagePartials/markets/borrow/Borrow'
import { Repay } from '@/src/pagePartials/markets/repay/Repay'
import { BorrowRepayTabs } from '@/types/modal'
import { Token } from '@/types/token'

const Tabs = styled(BaseTabs)`
  margin: 32px auto;
`

interface Props {
  activeTab?: BorrowRepayTabs
  interestRateMode: InterestRateMode
  onInterestRateSelect: (mode: InterestRateMode) => void
  onTokenSelect: (token: Token) => void
  setTab: (tab: BorrowRepayTabs) => void
  token: Token | null
}

export const BorrowRepay: React.FC<Props> = withGenericSuspense(
  ({ activeTab, interestRateMode, onInterestRateSelect, onTokenSelect, setTab, token }) => {
    const borrowActive = activeTab === 'borrow'
    const repayActive = activeTab === 'repay'

    return token ? (
      <>
        {borrowActive && <BorrowInfo token={token} />}
        {repayActive && <RepayInfo token={token} />}
        <Tabs>
          <Tab isActive={borrowActive} onClick={() => setTab('borrow')}>
            Borrow
          </Tab>
          <Tab isActive={repayActive} onClick={() => setTab('repay')}>
            Repay
          </Tab>
        </Tabs>
        {borrowActive && (
          <Borrow
            interestRateMode={interestRateMode}
            onInterestRateSelect={onInterestRateSelect}
            onTokenSelect={onTokenSelect}
            tokenAddress={token.address}
          />
        )}
        {repayActive && (
          <Repay
            interestRateMode={interestRateMode}
            onInterestRateSelect={onInterestRateSelect}
            onTokenSelect={onTokenSelect}
            tokenAddress={token.address}
          />
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

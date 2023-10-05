import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { Deposit } from '@/src/pagePartials/sdai/deposit/Deposit'
import { Redeem } from '@/src/pagePartials/sdai/redeem/Redeem'
import { DepositRedeemTabs } from '@/types/modal'

const Tabs = styled(BaseTabs)`
  margin: 32px auto;
`

export const addresses = {
  // TODO (Lia)
  WXDAI: '0x18c8a7ec7897177E4529065a7E7B0878358B3BfF',
  XDAI: '0x18c8a7ec7897177E4529065a7E7B0878358B3BfF',
  SDAI: '0x20e5eB701E8d711D419D444814308f8c2243461F',
}

export type Token = 'XDAI' | 'WXDAI'

interface Props {
  activeTab?: DepositRedeemTabs
  setTab: (tab: DepositRedeemTabs) => void
}

export const DepositRedeem: React.FC<Props> = withGenericSuspense(
  ({ activeTab, setTab }) => {
    const depositActive = activeTab === 'deposit'
    const redeemActive = activeTab === 'redeem'

    return (
      <>
        <Tabs>
          <Tab isActive={depositActive} onClick={() => setTab('deposit')}>
            Deposit
          </Tab>
          <Tab isActive={redeemActive} onClick={() => setTab('redeem')}>
            Redeem
          </Tab>
        </Tabs>
        {depositActive && <Deposit />}
        {redeemActive && <Redeem />}
      </>
    )
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

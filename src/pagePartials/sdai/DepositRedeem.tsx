import styled from 'styled-components'

import { InnerCardDark } from '@/src/components/common/InnerCard'
import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { contracts } from '@/src/contracts/contracts'
import { useGetERC4626MaxWithdraw } from '@/src/hooks/queries/useGetERC4626MaxWithdraw'
import { useGetBalance } from '@/src/hooks/queries/useGetSavingsUserData'
import { Deposit } from '@/src/pagePartials/sdai/deposit/Deposit'
import { Redeem } from '@/src/pagePartials/sdai/redeem/Redeem'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { formatAmount } from '@/src/utils/common'
import { DepositRedeemTabs } from '@/types/modal'

const Tabs = styled(BaseTabs)`
  margin: 32px auto;
`

interface TokenAddresses {
  WXDAI: string
  XDAI: string
  SDAI: string
  ADAPTER: string
}

export const addresses: TokenAddresses = {
  // TODO (Lia)
  WXDAI: contracts.WxDAI.address[100],
  XDAI: contracts.xDAI.address[100],
  SDAI: contracts.SavingsXDai.address[100],
  ADAPTER: contracts.SavingsXDaiAdapter.address[100],
}

export type Token = 'XDAI' | 'WXDAI'

interface Props {
  activeTab?: DepositRedeemTabs
  setTab: (tab: DepositRedeemTabs) => void
}

export const DepositRedeem: React.FC<Props> = withGenericSuspense(
  ({ activeTab, setTab }) => {
    const { address } = useWeb3ConnectedApp()
    const { balance } = useGetBalance(address, addresses.SDAI)
    const { maxWithdrawAmount } = useGetERC4626MaxWithdraw(addresses.SDAI)
    const Wrapper = styled.div`
      width: 100%;
      margin: 3rem 0px;
    `

    const depositActive = activeTab === 'deposit'
    const redeemActive = activeTab === 'redeem'
    return (
      <>
        <Wrapper>
          <InnerCardDark>
            <Rows>
              <Row variant="light">
                <RowKey>Your Shares</RowKey>
                <RowValueBig>{formatAmount(balance, 18, '')} sDAI</RowValueBig>
              </Row>
              <Row variant="light">
                <RowKey>Shares Value</RowKey>
                <RowValueBig>
                  {formatAmount(maxWithdrawAmount, 18, '$', 'before')} WXDAI
                </RowValueBig>
              </Row>
            </Rows>
          </InnerCardDark>
        </Wrapper>
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
      <SkeletonLoading
        style={{
          borderRadius: '16px',
          height: '135px',
          margin: '35px 0',
        }}
      />
      <Tabs style={{ height: '89px', maxWidth: 'none', width: '244px' }} />
      <SkeletonLoading
        style={{
          borderRadius: '16px',
          height: '400px',
        }}
      />
    </>
  ),
)

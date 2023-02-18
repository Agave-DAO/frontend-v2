import type { NextPage } from 'next'
import { useState } from 'react'
import styled from 'styled-components'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { UserAccountDetails } from '@/src/pagePartials/dashboard/UserAccountDetails'
import { UserBorrows } from '@/src/pagePartials/dashboard/UserBorrows'
import { UserDeposits } from '@/src/pagePartials/dashboard/UserDeposits'
import UserRewards from '@/src/pagePartials/index/UserRewards'
import { MarketList } from '@/src/pagePartials/markets/MarketList'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 auto 50px;
`

const Home: NextPage = () => {
  const [tab, setTab] = useState<'myAccount' | 'allMarkets'>('myAccount')
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const isConnected = isWalletConnected && isWalletNetworkSupported

  return (
    <>
      <RequiredConnection isNotConnectedText="Connect your wallet to see your account details">
        <Grid>
          <UserRewards />
          <UserAccountDetails />
        </Grid>
      </RequiredConnection>
      {isConnected && (
        <div style={{ marginBottom: '40px' }}>
          <button
            onClick={() => setTab('myAccount')}
            style={{ opacity: tab === 'allMarkets' ? '0.5' : '1' }}
          >
            My account
          </button>
          <button
            onClick={() => setTab('allMarkets')}
            style={{ opacity: tab === 'myAccount' ? '0.5' : '1' }}
          >
            All markets
          </button>
        </div>
      )}
      {(!isConnected || tab === 'allMarkets') && <MarketList />}
      {isConnected && tab === 'myAccount' && (
        <div>
          <UserDeposits />
          <UserBorrows />
        </div>
      )}
    </>
  )
}

export default Home

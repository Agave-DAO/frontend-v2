import type { NextPage } from 'next'

import { Account } from '@/src/pagePartials/account/Account'
import { HomeTabs } from '@/src/pagePartials/index/HomeTabs'
import { MarketList } from '@/src/pagePartials/markets/MarketList'

const Home: NextPage = () => {
  return (
    <>
      <Account />
      <HomeTabs>
        <MarketList />
      </HomeTabs>
    </>
  )
}

export default Home

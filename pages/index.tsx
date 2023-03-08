import type { NextPage } from 'next'

import { HomeTabs } from '@/src/components/common/HomeTabs'
import { Account } from '@/src/pagePartials/account/Account'
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

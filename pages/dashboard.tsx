import type { NextPage } from 'next'

import { UserDebts } from '@/src/pagePartials/dashboard/UserBorrows'

const Dashboard: NextPage = () => {
  return (
    <>
      <UserDebts />
    </>
  )
}

export default Dashboard

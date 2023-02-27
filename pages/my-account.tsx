import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { HomeTabs } from '@/src/components/common/HomeTabs'
import { Account } from '@/src/pagePartials/dashboard/Account'
import { UserBorrows } from '@/src/pagePartials/dashboard/UserBorrows'
import { UserDeposits } from '@/src/pagePartials/dashboard/UserDeposits'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const MyAccount: NextPage = () => {
  const { isWalletConnected, isWalletNetworkSupported } = useWeb3Connection()
  const router = useRouter()

  useEffect(() => {
    if (!(isWalletConnected && isWalletNetworkSupported)) {
      router.push('/')
    }
  }, [isWalletConnected, isWalletNetworkSupported, router])

  return (
    <>
      <Account />
      <HomeTabs>
        <UserDeposits />
        <UserBorrows />
      </HomeTabs>
    </>
  )
}

export default MyAccount

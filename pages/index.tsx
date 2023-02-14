import type { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import UserRewards from '@/src/pagePartials/index/UserRewards'

const Card = styled(BaseCard)`
  min-height: 300px;
`

const Home: NextPage = () => {
  return (
    <>
      <BaseTitle>Welcome to BootNode-web3-Next.js!</BaseTitle>
      <Card>
        <Link href={'/markets'}>Markets</Link>
        <UserRewards />
      </Card>
    </>
  )
}

export default Home

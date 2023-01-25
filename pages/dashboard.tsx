import type { NextPage } from 'next'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { UserBorrows } from '@/src/pagePartials/dashboard/UserBorrows'
import { UserDeposits } from '@/src/pagePartials/dashboard/UserDeposits'

const Grid = styled.div`
  align-items: flex-start;
  column-gap: 20px;
  display: flex;
  row-gap: 20px;
  > * {
    flex: 1;
    text-align: center;
  }
`

const Dashboard: NextPage = () => {
  return (
    <>
      <BaseCard>
        <Grid>
          <UserBorrows />
          <UserDeposits />
        </Grid>
      </BaseCard>
    </>
  )
}

export default Dashboard

import { NextPage } from 'next'
import styled from 'styled-components'

import { HomeTabs } from '@/src/components/common/HomeTabs'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { Account } from '@/src/pagePartials/account/Account'
import { MyRewards } from '@/src/pagePartials/dashboard/MyRewards'
import { UserBorrows } from '@/src/pagePartials/dashboard/UserBorrows'
import { UserDeposits } from '@/src/pagePartials/dashboard/UserDeposits'

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 40px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    row-gap: 56px;
  }
`

const AccountSection = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 32px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    row-gap: 32px;
  }
`

const Title = styled.h2`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.4rem;
  }
`

const MyAccount: NextPage = () => {
  return (
    <RequiredConnection>
      <>
        <Account />
        <HomeTabs>
          <AccountDetails>
            <AccountSection>
              <Title>My rewards</Title>
              <MyRewards />
            </AccountSection>
            <AccountSection>
              <Title>My deposits</Title>
              <UserDeposits />
            </AccountSection>
            <AccountSection>
              <Title>My borrows</Title>
              <UserBorrows />
            </AccountSection>
          </AccountDetails>
        </HomeTabs>
      </>
    </RequiredConnection>
  )
}

export default MyAccount

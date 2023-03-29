import { NextPage } from 'next'
import styled from 'styled-components'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { BaseParagraph as Paragraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { FundsInSafetyModule } from '@/src/pagePartials/stake/FundsInSafetyModule'
import { StakeInformationCard } from '@/src/pagePartials/stake/StakeInformationCard'
import { UserStakeActionCard } from '@/src/pagePartials/stake/UserStakeActionCard'
import { UserStakeClaimCard } from '@/src/pagePartials/stake/UserStakeClaimCard'
import { UserStakedCard } from '@/src/pagePartials/stake/UserStakedCard'

const Title = styled(BaseTitle)`
  margin-top: 23px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-top: 0;
  }
`

const Funds = styled(FundsInSafetyModule)`
  margin-bottom: 16px;
`

const BigContainer = styled(OuterContainer)`
  margin-bottom: 64px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 48px;
  }
`

const StakeForm = styled(UserStakeActionCard)`
  margin-bottom: 40px;
`

const Staked = styled(UserStakedCard)`
  margin-bottom: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 24px;
  }
`

const StakeClaim = styled(UserStakeClaimCard)`
  margin-bottom: 40px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 56px;
  }
`

const Stake: NextPage = () => {
  return (
    <>
      <Title>Staking</Title>
      <Paragraph>
        Staking Agave in the Safety Module helps to secure the protocol in exchange for protocol
        incentives
      </Paragraph>
      <RequiredConnection>
        <>
          <Funds />
          <StakeForm />
          <BigContainer>
            <Staked />
            <StakeClaim />
            <StakeInformationCard />
          </BigContainer>
        </>
      </RequiredConnection>
    </>
  )
}

export default Stake

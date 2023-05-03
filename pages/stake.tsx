import { NextPage } from 'next'
import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Faq } from '@/src/components/faq/Faq'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { BaseParagraph as Paragraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { stakeFAQ } from '@/src/constants/stakeFAQ'
import { FundsInSafetyModule } from '@/src/pagePartials/stake/FundsInSafetyModule'
import { StakeInformationCard } from '@/src/pagePartials/stake/StakeInformationCard'
import { UserStakeActionCard } from '@/src/pagePartials/stake/UserStakeActionCard'
import { UserStakeClaimCard } from '@/src/pagePartials/stake/UserStakeClaimCard'
import { UserStakedCard } from '@/src/pagePartials/stake/UserStakedCard'

const MandatoryConnection = styled(RequiredConnection)`
  height: 300px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 500px;
  }
`

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
  padding-bottom: 100px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 48px;
    padding-bottom: 40px;
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
      <Title hasExtraControls>
        Staking
        <ActionButton
          onClick={() => window.open('https://swap.cow.fi/#/100/swap/XDAI/AGVE', '_blank')}
          variant="ultraLight"
        >
          Buy <b>AGVE</b>
        </ActionButton>
      </Title>
      <Paragraph>
        Staking Agave in the Safety Module helps to secure the protocol in exchange for protocol
        incentives
      </Paragraph>
      <MandatoryConnection>
        <Funds />
        <StakeForm />
        <BigContainer>
          <Staked />
          <StakeClaim />
          <StakeInformationCard />
        </BigContainer>
      </MandatoryConnection>
      <Faq data={stakeFAQ} title="Staking Frequently Asked Questions" />
    </>
  )
}

export default Stake

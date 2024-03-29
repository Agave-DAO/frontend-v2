import { NextPage } from 'next'
import styled from 'styled-components'

import { AddToWallet } from '@/src/components/assets/AddToWallet'
import { ViewOnExplorer } from '@/src/components/assets/ViewOnExplorer'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Faq } from '@/src/components/faq/Faq'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { BaseParagraph as Paragraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { FundsInStakingModule } from '@/src/pagePartials/stake/FundsInStakingModule'
import { StakeInformationCard } from '@/src/pagePartials/stake/StakeInformationCard'
import { UserStakeActionCard } from '@/src/pagePartials/stake/UserStakeActionCard'
import { UserStakeClaimCard } from '@/src/pagePartials/stake/UserStakeClaimCard'
import { UserStakedCard } from '@/src/pagePartials/stake/UserStakedCard'
import { stakeFAQ } from '@/src/pagePartials/stake/stakeFAQ'

const MandatoryConnection = styled(RequiredConnection)`
  height: 300px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 500px;
  }
`

const Title = styled(BaseTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 23px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-top: 0;
  }
`

const Funds = styled(FundsInStakingModule)`
  margin-bottom: 16px;
`

const BigContainer = styled(OuterContainer)`
  padding-bottom: 100px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 48px;
    padding-bottom: 40px;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
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

const Button = styled(ActionButton)`
  cursor: pointer;
`

const Redeem: NextPage = () => {
  return (
    <>
      <Title>
        AGVE
        <Button
          onClick={() => window.open('https://swap.cow.fi/#/100/swap/XDAI/AGVE', '_blank')}
          variant="ultraLight"
        >
          Buy <b>AGVE</b>
        </Button>
      </Title>
      <Paragraph>You can redeem you AGVE for Agave DAO Treasury holdings</Paragraph>

      <MandatoryConnection>
        <ButtonsContainer>
          <ViewOnExplorer hover symbol="AGVE" text="View on explorer" />
          <AddToWallet hover symbol="AGVE" text="Add to wallet" />
        </ButtonsContainer>
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

export default Redeem

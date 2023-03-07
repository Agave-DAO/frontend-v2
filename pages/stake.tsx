import { NextPage } from 'next'

import { BaseCard } from '@/src/components/common/BaseCard'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { StakeInformationCard } from '@/src/pagePartials/stake/StakeInformationCard'
import { UserStakeActionCard } from '@/src/pagePartials/stake/UserStakeActionCard'
import { UserStakeClaimCard } from '@/src/pagePartials/stake/UserStakeClaimCard'
import { UserStakedCard } from '@/src/pagePartials/stake/UserStakedCard'

const Stake: NextPage = () => {
  return (
    <>
      <BaseTitle>Staking</BaseTitle>
      <BaseParagraph>
        Staking Agave in the Safety Module helps to secure the protocol in exchange for protocol
        incentives
      </BaseParagraph>

      <>
        <BaseCard>
          <RequiredConnection>
            <>
              <UserStakeActionCard />
              <UserStakedCard />
              <UserStakeClaimCard />
              <StakeInformationCard />
            </>
          </RequiredConnection>
        </BaseCard>
      </>
      <br />
    </>
  )
}

export default Stake

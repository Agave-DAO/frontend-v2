import { useState } from 'react'
import styled from 'styled-components'

import TxButton from '@/src/components/buttons/txButton'
import { InnerCard } from '@/src/components/common/InnerCard'
import { Button } from '@/src/components/common/StepsCard'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { AgaveTotal } from '@/src/components/token/AgaveTotal'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { ProgressBar } from '@/src/pagePartials/stake/ProgressBar'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { fromWei } from '@/src/utils/common'
import { StakedToken__factory } from '@/types/generated/typechain'

const Staked = styled.div``

const StakeActionCard = styled.div`
  align-items: flex-start;
  background-color: ${({ theme: { colors } }) => colors.secondary50};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 24px 16px 16px;
`

const CoolingDown = styled(StakeActionCard)``

const Unstake = styled(StakeActionCard)``

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 24px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

export const UserStakedCard: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { address } = useWeb3ConnectedApp()
    const {
      activateCooldownFrom: activateCooldownFrom,
      activateCooldownReady: userActivateCooldownReady,
      activateCooldownTo: userActivateCooldownTo,
      agvePrice,
      amountStaked: userAmountStaked,
      isCooldownActive,
      isInUnstakeWindow,
      refetchAllStakeData,
    } = useStakeInformation()

    const [isActivateCooldownLoading, setIsActivateCooldownLoading] = useState(false)
    const [isWithdrawFundsLoading, setIsWithdrawFundsLoading] = useState(false)

    const showInitialCooldown =
      isCooldownActive && !isInUnstakeWindow && !!userActivateCooldownReady
    const showUnstakeWindowCooldown = isInUnstakeWindow && !!userActivateCooldownTo

    const { cooldown, redeem } = useContractInstance(StakedToken__factory, 'StakedToken', true)

    const ActivateCooldownButton: React.FC = ({ ...restProps }) => {
      const submitDisabled = isActivateCooldownLoading || userAmountStaked.isZero()

      return (
        <TxButton
          disabled={submitDisabled}
          onFail={() => {
            setIsActivateCooldownLoading(false)
          }}
          onMined={async () => {
            await refetchAllStakeData()
            setIsActivateCooldownLoading(false)
          }}
          tx={() => {
            setIsActivateCooldownLoading(true)
            return cooldown()
          }}
          {...restProps}
        >
          Activate cooldown
        </TxButton>
      )
    }

    const WithdrawFundsButton: React.FC = ({ ...restProps }) => {
      const submitDisabled = isWithdrawFundsLoading

      return (
        <TxButton
          disabled={submitDisabled}
          onFail={() => {
            setIsWithdrawFundsLoading(false)
          }}
          onMined={async () => {
            await refetchAllStakeData()
            setIsWithdrawFundsLoading(false)
          }}
          tx={() => {
            setIsWithdrawFundsLoading(true)
            return redeem(address, userAmountStaked)
          }}
          {...restProps}
        >
          Withdraw
        </TxButton>
      )
    }

    return (
      <InnerCard {...restProps}>
        <Staked>
          <AgaveTotal
            agave={<Amount decimals={18} symbol="" value={userAmountStaked} />}
            title="Agave staked"
            usd={<Amount value={fromWei((agvePrice || ZERO_BN).mul(userAmountStaked))} />}
          />
          {!isCooldownActive && <Button as={ActivateCooldownButton} />}
        </Staked>
        {showInitialCooldown && activateCooldownFrom && (
          <CoolingDown>
            <Title>Cooling down</Title>
            <Text>Your tokens will be unlocked when the cooldown process is finished.</Text>
            <ProgressBar
              end={userActivateCooldownReady}
              label="Unlocking in"
              start={activateCooldownFrom}
            />
          </CoolingDown>
        )}
        {showUnstakeWindowCooldown && userActivateCooldownReady && (
          <Unstake>
            <Title>Unstake window</Title>
            <Text>You are able to withdraw within the time frame of the unstake window.</Text>
            <ProgressBar
              end={userActivateCooldownTo}
              label="Active for"
              start={userActivateCooldownReady}
            />
            <Button as={WithdrawFundsButton} />
          </Unstake>
        )}
      </InnerCard>
    )
  },
  ({ ...restProps }) => <SkeletonLoading style={{ height: '190px' }} {...restProps} />,
)

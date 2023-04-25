import { useState } from 'react'

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
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { fromWei } from '@/src/utils/common'
import { NumberType } from '@/src/utils/format'
import { StakedToken__factory } from '@/types/generated/typechain'

export const UserStakeClaimCard: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { address } = useWeb3ConnectedApp()
    const {
      agvePrice,
      amountAvailableToClaim: userAmountAvailableToClaim,
      refetchAllStakeData,
    } = useStakeInformation()
    const [isClaimLoading, setIsClaimLoading] = useState(false)
    const { claimRewards } = useContractInstance(StakedToken__factory, 'StakedToken', true)
    const submitDisabled = userAmountAvailableToClaim.isZero() || isClaimLoading

    const ClaimButton: React.FC = ({ ...restProps }) => (
      <TxButton
        disabled={submitDisabled}
        onFail={() => {
          setIsClaimLoading(false)
        }}
        onMined={async () => {
          await refetchAllStakeData()
          setIsClaimLoading(false)
        }}
        tx={() => {
          setIsClaimLoading(true)
          return claimRewards(address, userAmountAvailableToClaim)
        }}
        {...restProps}
      >
        Claim
      </TxButton>
    )

    return (
      <InnerCard {...restProps}>
        <AgaveTotal
          agave={
            <Amount
              decimals={18}
              numberType={NumberType.TokenTx}
              symbol=""
              value={userAmountAvailableToClaim}
            />
          }
          title="Claimable Agave"
          usd={<Amount value={fromWei((agvePrice || ZERO_BN).mul(userAmountAvailableToClaim))} />}
        />
        <Button as={ClaimButton} />
      </InnerCard>
    )
  },
  ({ ...restProps }) => <SkeletonLoading style={{ height: '190px' }} {...restProps} />,
)

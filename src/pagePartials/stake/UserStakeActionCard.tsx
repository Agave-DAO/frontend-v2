import { useMemo, useState } from 'react'

import { BigNumber } from 'ethers'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { TxButtonStyled } from '@/src/components/buttons/txButton'
import { BaseCard } from '@/src/components/common/BaseCard'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput } from '@/src/components/token/TokenInput'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { ERC20__factory, StakedToken__factory } from '@/types/generated/typechain'

export const UserStakeActionCard = withGenericSuspense(() => {
  const { address } = useWeb3ConnectedApp()
  const {
    amountAvailableToStake: userAmountAvailableToStake,
    isCooldownActive,
    refetchAllStakeData,
    stakedTokenAddress,
  } = useStakeInformation()

  const stakingContract = useContractInstance(StakedToken__factory, 'StakedToken')
  const stakedToken = useContractInstance(ERC20__factory, stakedTokenAddress)

  const { approvedAmount, refetchAllowance } = useGetERC20Allowance(
    stakedTokenAddress,
    stakingContract.address,
  )

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const [value, setValue] = useState('0')
  const [isStakeLoading, setIsStakeLoading] = useState(false)
  const [isApproveLoading, setIsApproveLoading] = useState(false)

  const disableSubmit = useMemo(() => {
    return (
      tokenInputStatus === TextfieldStatus.error ||
      BigNumber.from(value || ZERO_BN).eq(ZERO_BN) ||
      isStakeLoading ||
      isApproveLoading
    )
  }, [tokenInputStatus, value, isStakeLoading, isApproveLoading])

  const ApproveButton = () => {
    // if user approved an amount, but it's less than the amount they want to stake, then the user needs to reset the approval, or stake the amount they already approved
    const resetRequired =
      !approvedAmount.isZero() && BigNumber.from(value || ZERO_BN).gt(approvedAmount)

    // if user has approved an amount, and it's greater than or equal to the amount they want to stake, then they don't need to approve again
    const isApproved = !approvedAmount.isZero() && approvedAmount.gte(value || ZERO_BN)

    let buttonText = 'Approve AGVE to continue'
    if (resetRequired) {
      buttonText = 'Reset approve'
    }
    if (isApproved) {
      buttonText = 'Approved'
    }

    return (
      <TxButtonStyled
        disabled={disableSubmit || isApproved}
        onFail={() => setIsApproveLoading(false)}
        onMined={async () => {
          await refetchAllowance()
          setIsApproveLoading(false)
        }}
        onSend={() => setIsApproveLoading(true)}
        style={{ width: '100%', margin: '10px 0' }}
        tx={() => {
          setIsApproveLoading(true)
          return stakedToken.approve(stakingContract.address, resetRequired ? ZERO_BN : value)
        }}
      >
        {buttonText}
      </TxButtonStyled>
    )
  }

  const StakeButton = () => (
    <>
      <TxButtonStyled
        disabled={disableSubmit || approvedAmount.lt(value || ZERO_BN)}
        onFail={() => setIsStakeLoading(false)}
        onMined={async () => {
          await refetchAllStakeData()
          await refetchAllowance()
          setIsStakeLoading(false)
          setValue('')
        }}
        onSend={() => setIsStakeLoading(true)}
        style={{ width: '100%', margin: '10px 0' }}
        tx={() => {
          setIsStakeLoading(true)
          return stakingContract.stake(address, value)
        }}
      >
        <SimpleGrid style={{ alignItems: 'center' }}>
          Stake AGVE
          {isCooldownActive && (
            <Tooltip
              content="You have an active cooldown. The time period will be affected by the new amount you
            stake."
            />
          )}
        </SimpleGrid>
      </TxButtonStyled>
    </>
  )

  return (
    <BaseCard>
      <SimpleGrid>
        <p>Amount to stake:</p>
        <ButtonPrimary onClick={() => setValue(userAmountAvailableToStake.toString())}>
          Use Max
        </ButtonPrimary>
      </SimpleGrid>
      <SimpleGrid>
        <p>available to stake:</p>
        <h2>
          <Amount
            decimals={18}
            displayDecimals={6}
            symbol="AGVE"
            symbolPosition="after"
            value={userAmountAvailableToStake}
          />
        </h2>
      </SimpleGrid>
      <TokenInput
        decimals={18}
        maxValue={userAmountAvailableToStake.toString()}
        setStatus={setTokenInputStatus}
        setStatusText={setTokenInputStatusText}
        setValue={setValue}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
        symbol={'AGVE'}
        value={value}
      />
      {!BigNumber.from(value || '0').isZero() ? (
        <>
          <ApproveButton />
          <StakeButton />
        </>
      ) : (
        <ButtonPrimary disabled style={{ width: '100%', margin: '10px 0' }}>
          Enter an amount
        </ButtonPrimary>
      )}
    </BaseCard>
  )
})

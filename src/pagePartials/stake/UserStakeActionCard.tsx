import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import TxButton from '@/src/components/buttons/txButton'
import { StepAuxiliaryAction } from '@/src/components/common/StepAuxiliaryAction'
import {
  Rows as BaseRows,
  Button,
  ButtonWrapper,
  Row,
  RowKey,
  RowValueBig,
  StepsCard,
} from '@/src/components/common/StepsCard'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { StepForm } from '@/src/pagePartials/markets/stepper/Stepper'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import {
  AgaveTreasuryRedeemer__factory,
  ERC20__factory,
  StakedToken__factory,
} from '@/types/generated/typechain'

const Rows = styled(BaseRows)`
  margin-bottom: 16px;
`

export const UserStakeActionCard: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { address } = useWeb3ConnectedApp()
    const {
      agvePrice,
      amountAvailableToStake: userAmountAvailableToStake,
      isCooldownActive,
      refetchAllStakeData,
      stakedTokenAddress,
    } = useStakeInformation()

    const stakingContract = useContractInstance(StakedToken__factory, 'StakedToken', true)
    const treasuryRedeemer = useContractInstance(
      AgaveTreasuryRedeemer__factory,
      'AgaveTreasuryRedeemer',
      true,
    )
    const stakedToken = useContractInstance(ERC20__factory, stakedTokenAddress, true)

    const { approvedAmount, refetchAllowance } = useGetERC20Allowance(
      stakedTokenAddress,
      treasuryRedeemer.address,
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

    /**
     * User approved an amount, but it's less than the amount they want to stake,
     * then the user needs to reset the approval, or stake the amount they
     * already approved
     */
    const resetRequired = useMemo(
      () => !approvedAmount.isZero() && BigNumber.from(value || ZERO_BN).gt(approvedAmount),
      [approvedAmount, value],
    )

    /**
     * User has approved an amount, and it's greater than or equal to the amount
     * they want to stake, then they don't need to approve again
     */
    const isApproved = useMemo(
      () => !approvedAmount.isZero() && approvedAmount.gte(value || ZERO_BN),
      [approvedAmount, value],
    )

    const ApproveButton: React.FC = ({ ...restProps }) => {
      return (
        <TxButton
          disabled={disableSubmit || isApproved}
          onFail={() => setIsApproveLoading(false)}
          onMined={async () => {
            await refetchAllowance()
            setIsApproveLoading(false)
          }}
          onSend={() => setIsApproveLoading(true)}
          tx={() => {
            setIsApproveLoading(true)
            return stakedToken.approve(treasuryRedeemer.address, resetRequired ? ZERO_BN : value)
          }}
          {...restProps}
        >
          {resetRequired ? 'Reset approve' : isApproved ? 'Approved' : 'Approve AGVE to continue'}
        </TxButton>
      )
    }

    const StakeButton: React.FC = ({ ...restProps }) => (
      <>
        <TxButton
          disabled={disableSubmit || approvedAmount.lt(value || ZERO_BN)}
          onFail={() => setIsStakeLoading(false)}
          onMined={async () => {
            await refetchAllStakeData()
            await refetchAllowance()
            setIsStakeLoading(false)
            setValue('')
          }}
          onSend={() => setIsStakeLoading(true)}
          tx={() => {
            setIsStakeLoading(true)
            return treasuryRedeemer.redeem(value)
          }}
          {...restProps}
        >
          Redeem
        </TxButton>
      </>
    )

    return (
      <StepsCard {...restProps}>
        <StepAuxiliaryAction
          button={{
            text: 'Use max',
            onClick: () => setValue(userAmountAvailableToStake.toString()),
            variant: 'regular',
          }}
          title={'Amount to redeem'}
        />
        <Rows>
          <Row>
            <RowKey>Available to redeem</RowKey>
            <RowValueBig>
              <TokenIcon dimensions={18} symbol="AGVE" />
              <Amount decimals={18} symbol="" value={userAmountAvailableToStake} />
            </RowValueBig>
          </Row>
        </Rows>
        <StepForm>
          <TokenInput
            decimals={18}
            maxValue={userAmountAvailableToStake.toString()}
            setStatus={setTokenInputStatus}
            setStatusText={setTokenInputStatusText}
            setValue={setValue}
            status={tokenInputStatus}
            statusText={tokenInputStatusText}
            symbol={'AGVE'}
            usdPrice={agvePrice}
            value={value}
          />
          <ButtonWrapper>
            {BigNumber.from(value || '0').isZero() ? (
              <Button disabled>Enter an amount</Button>
            ) : (
              <>
                {resetRequired || !isApproved ? (
                  <Button as={ApproveButton} />
                ) : (
                  <Button as={StakeButton} />
                )}
              </>
            )}
          </ButtonWrapper>
        </StepForm>
      </StepsCard>
    )
  },
  ({ ...restProps }) => <SkeletonLoading style={{ height: '311px' }} {...restProps} />,
)

import { useEffect } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { Row, RowKey, RowValue, RowValueBig, Text } from '@/src/components/common/StepsCard'
import { ToggleSwitch } from '@/src/components/form/ToggleSwitch'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { Steps } from '@/src/pagePartials/markets/stepper'
import { Token } from '@/src/pagePartials/sdai/DepositRedeem'
import { useRedeemSteps } from '@/src/pagePartials/sdai/redeem/hooks/useRedeemSteps'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useUserActionsContext } from '@/src/providers/userActionsProvider'

interface RedeemStepperInfoProps {
  amount: string
  tokenAddress: string
  unlimitedApprovalToggle: () => React.ReactNode
}

const RedeemStepperInfo = ({
  amount,
  tokenAddress,
  unlimitedApprovalToggle,
}: RedeemStepperInfoProps) => {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  return (
    <>
      <Text>
        These are your transaction details.
        <br />
        Please verify them before submitting.
      </Text>
      <Row variant="dark">
        <RowKey>Amount</RowKey>
        <RowValueBig>
          <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
          <Amount decimals={tokenInfo.decimals} symbol="" value={BigNumber.from(amount)} />
        </RowValueBig>
      </Row>
      {unlimitedApprovalToggle()}
    </>
  )
}

interface RedeemStepperProps {
  amount: string
  cancel: () => void
  selectedToken: Token
  tokenAddress: string
}

export const RedeemStepper = ({
  amount,
  cancel,
  selectedToken,
  tokenAddress,
}: RedeemStepperProps) => {
  const redeemSteps = useRedeemSteps({ tokenAddress, cancel, selectedToken, amount })

  const { setUnlimitedApproval, unlimitedApproval } = useUserActionsContext()

  const showUnlimitedOption = true

  useEffect(() => {
    if (!showUnlimitedOption) {
      setUnlimitedApproval(false)
    }
  }, [tokenAddress, setUnlimitedApproval, showUnlimitedOption])

  const { title } = redeemSteps.currentStep

  const renderUnlimitedApprovalToggle = () => {
    if (showUnlimitedOption && title === 'Approve') {
      return (
        <Row variant="dark">
          <RowKey>Unlimited approval</RowKey>
          <RowValue>
            <ToggleSwitch
              appearance="mini"
              checked={unlimitedApproval}
              onChange={() => {
                setUnlimitedApproval(!unlimitedApproval)
              }}
            />
          </RowValue>
        </Row>
      )
    }
    return null
  }

  const params = {
    ...redeemSteps,
    info: (
      <RedeemStepperInfo
        amount={amount}
        tokenAddress={tokenAddress}
        unlimitedApprovalToggle={renderUnlimitedApprovalToggle}
      />
    ),
    title: 'Redeem overview',
    titleButton: { onClick: cancel, text: 'Cancel', variant: 'danger' as const },
  }

  return <Steps {...params} />
}

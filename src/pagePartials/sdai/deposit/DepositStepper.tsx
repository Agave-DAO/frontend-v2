import { useEffect } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { Row, RowKey, RowValue, RowValueBig, Text } from '@/src/components/common/StepsCard'
import { ToggleSwitch } from '@/src/components/form/ToggleSwitch'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { Steps } from '@/src/pagePartials/markets/stepper'
import { useDepositStepInitial } from '@/src/pagePartials/sdai/deposit/hooks/useDepositStepInitial'
import { useDepositSteps } from '@/src/pagePartials/sdai/deposit/hooks/useDepositSteps'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useUserActionsContext } from '@/src/providers/userActionsProvider'

interface DepositStepperInfoProps {
  amount: string
  tokenAddress: string
  unlimitedApprovalToggle: () => React.ReactNode
}

const DepositStepperInfo = ({
  amount,
  tokenAddress,
  unlimitedApprovalToggle,
}: DepositStepperInfoProps) => {
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)

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

interface DepositStepperProps {
  amount: string
  cancel: () => void
  tokenAddress: string
}

export const DepositStepper = ({ amount, cancel, tokenAddress }: DepositStepperProps) => {
  const depositSteps = useDepositSteps({ amount, cancel, tokenAddress })

  const { tokenInfo } = useDepositStepInitial({ amount, tokenAddress })
  const { setUnlimitedApproval, unlimitedApproval } = useUserActionsContext()
  const showUnlimitedOption = tokenInfo.symbol === 'WXDAI'

  useEffect(() => {
    if (!showUnlimitedOption) {
      setUnlimitedApproval(false)
    }
  }, [tokenAddress, setUnlimitedApproval, showUnlimitedOption])

  const { title } = depositSteps.currentStep

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
    ...depositSteps,
    info: (
      <DepositStepperInfo
        amount={amount}
        tokenAddress={tokenAddress}
        unlimitedApprovalToggle={renderUnlimitedApprovalToggle}
      />
    ),
    title: 'Deposit overview',
    titleButton: { onClick: cancel, text: 'Cancel', variant: 'danger' as const },
  }

  return <Steps {...params} />
}

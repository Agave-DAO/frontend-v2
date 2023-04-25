import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { InnerCard } from '@/src/components/common/InnerCard'
import { MoreActionsDropdown } from '@/src/components/common/MoreActionsDropdown'
import { EmphasizedRowValue, Row, RowKey, RowValue, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Text as ECText, Title as ECTitle } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { Loading } from '@/src/components/loading/Loading'
import { InnerTitle } from '@/src/components/text/InnerTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useUserDepositsInformationByToken } from '@/src/hooks/presentation/useUserDepositsInformationByToken'
import { useTokenActionsModalsContext } from '@/src/providers/tokenActionsModalProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const UserDepositsImp: React.FC<{
  tokenAddress: string
  userAddress: string
}> = ({ tokenAddress, userAddress, ...restProps }) => {
  const { balance, depositedAmount, userHasDeposits } = useUserDepositsInformationByToken({
    tokenAddress,
    userAddress,
  })
  const { decimals, symbol } = agaveTokens.getTokenByAddress(tokenAddress)

  return userHasDeposits ? (
    <Rows {...restProps}>
      <Row variant="dark">
        <RowKey>Your wallet balance</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={symbol} />
          <EmphasizedRowValue>
            <Amount decimals={decimals} symbol="" value={balance} />
          </EmphasizedRowValue>
        </RowValue>
      </Row>
      <Row>
        <RowKey>You already deposited</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={symbol} />
          <EmphasizedRowValue>
            <Amount decimals={decimals} symbol="" value={depositedAmount} />
          </EmphasizedRowValue>
        </RowValue>
      </Row>
    </Rows>
  ) : (
    <></>
  )
}

const Wrapper = styled.div``

const Top = styled(InnerCard)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`

const Bottom = styled(InnerCard)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`

const Title = styled(InnerTitle)`
  font-size: 1.4rem;
  margin-bottom: 24px;
  padding-top: 16px;
`

export const UserDepositDetails = withGenericSuspense(
  ({ tokenAddress, ...restProps }: { tokenAddress: string }) => {
    const { address: userAddress } = useWeb3ConnectedApp()
    const { userHasDeposits } = useUserDepositsInformationByToken({
      tokenAddress,
      userAddress,
    })
    const { openDepositWithdrawModal } = useTokenActionsModalsContext()

    const items = [
      {
        text: 'Withdraw',
        onClick: () => openDepositWithdrawModal({ tokenAddress, action: 'withdraw' }),
      },
    ]

    return (
      <>
        <Wrapper {...restProps}>
          <Top>
            <Title>Deposits</Title>
            {userHasDeposits ? (
              <UserDepositsImp tokenAddress={tokenAddress} userAddress={userAddress} />
            ) : (
              <>
                <ECTitle>Nothing deposited yet</ECTitle>
                <ECText>
                  Your account is empty. Move cryptocurrency from your wallet and start earning
                  interest.
                </ECText>
              </>
            )}
          </Top>
          <Bottom>
            <ActionsWrapper>
              <MoreActionsDropdown disabled={!userHasDeposits} items={items} size="lg" />
              <ActionButton
                onClick={() =>
                  openDepositWithdrawModal({
                    tokenAddress,
                    action: 'deposit',
                  })
                }
              >
                Deposit
              </ActionButton>
            </ActionsWrapper>
          </Bottom>
        </Wrapper>
      </>
    )
  },
  () => <Loading text="Fetching user deposits..." />,
)

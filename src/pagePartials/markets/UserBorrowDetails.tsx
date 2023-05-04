import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { HealthFactor } from '@/src/components/common/HealthFactor'
import { InnerCard } from '@/src/components/common/InnerCard'
import { EmphasizedRowValue, Row, RowKey, RowValue, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Text as ECText, Title as ECTitle } from '@/src/components/helpers/EmptyContent'
import { Percentage } from '@/src/components/helpers/Percentage'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { Loading } from '@/src/components/loading/Loading'
import { InnerTitle } from '@/src/components/text/InnerTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useUserBorrowsInformationByToken } from '@/src/hooks/presentation/useUserBorrowsInformationByToken'
import { HealthFactor as HealthFactorTooltip } from '@/src/pagePartials/common/tooltips'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useModalsContext } from '@/src/providers/modalsProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const UserBorrowsImp = ({
  tokenAddress,
  userAddress,
  ...restProps
}: {
  tokenAddress: string
  userAddress: string
}) => {
  const { healthFactor, ltv, maxBorrow, stableDebtAmount, userHasBorrows, variableDebtAmount } =
    useUserBorrowsInformationByToken({
      tokenAddress,
      userAddress,
    })
  const agaveTokens = useAgaveTokens()
  const { decimals, symbol } = agaveTokens.getTokenByAddress(tokenAddress)

  return userHasBorrows ? (
    <Rows {...restProps}>
      <Row>
        <RowKey>Stable borrowed</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={symbol} />
          <EmphasizedRowValue>
            <Amount decimals={decimals} symbol="" value={stableDebtAmount || ZERO_BN} />
          </EmphasizedRowValue>
        </RowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Variable borrowed</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={symbol} />
          <EmphasizedRowValue>
            <Amount decimals={decimals} symbol="" value={variableDebtAmount || ZERO_BN} />
          </EmphasizedRowValue>
        </RowValue>
      </Row>
      <Row>
        <RowKey>
          Health factor <Tooltip content={HealthFactorTooltip} />
        </RowKey>
        <RowValue>
          <HealthFactor badgeVariant="light" size="sm" value={healthFactor} variant="dark" />
        </RowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Loan to value</RowKey>
        <RowValue>
          <Percentage decimals={2} value={ltv} />
        </RowValue>
      </Row>
      <Row>
        <RowKey>You can borrow</RowKey>
        <RowValue>
          <TokenIcon dimensions={18} symbol={symbol} />
          <EmphasizedRowValue>{maxBorrow}</EmphasizedRowValue>
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

export const UserBorrowDetails = withGenericSuspense(
  ({ tokenAddress, ...restProps }: { tokenAddress: string }) => {
    const { address: userAddress } = useWeb3ConnectedApp()
    const { userHasBorrows } = useUserBorrowsInformationByToken({
      tokenAddress,
      userAddress,
    })
    const { openBorrowRepayModal } = useModalsContext()

    return (
      <Wrapper {...restProps}>
        <Top>
          <Title>Borrows</Title>
          {userHasBorrows ? (
            <UserBorrowsImp tokenAddress={tokenAddress} userAddress={userAddress} />
          ) : (
            <>
              <ECTitle>Nothing borrowed yet</ECTitle>
              <ECText>
                In order to borrow you need to deposit any asset to be used as collateral.
              </ECText>
            </>
          )}
        </Top>
        <Bottom>
          <ActionsWrapper>
            <ActionButton
              disabled={!userHasBorrows}
              onClick={() => openBorrowRepayModal({ activeTab: 'repay', tokenAddress })}
              variant="dark"
            >
              Repay
            </ActionButton>
            <ActionButton
              onClick={() => openBorrowRepayModal({ activeTab: 'borrow', tokenAddress })}
            >
              Borrow
            </ActionButton>
          </ActionsWrapper>
        </Bottom>
      </Wrapper>
    )
  },
  () => <Loading text="Fetching user borrows..." />,
)

import styled from 'styled-components'

import { InnerTitle } from '@/src/components/text/InnerTitle'
import { useMarketDetails } from '@/src/hooks/presentation/useMarketDetails'
import { UserBorrowDetails } from '@/src/pagePartials/markets/UserBorrowDetails'
import { UserDepositDetails } from '@/src/pagePartials/markets/UserDepositDetails'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  background-color: ${({ theme: { colors } }) => colors.darkestGray};
  display: flex;
  flex-direction: column;
  margin-bottom: calc(var(--outer-container-bottom-padding) * -1);
  margin-left: calc(var(--outer-container-horizontal-padding) * -1);
  margin-right: calc(var(--outer-container-horizontal-padding) * -1);
  margin-top: 26px;
  padding: 48px 16px 32px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    border-radius: 16px;
    box-shadow: 0 53px 80px rgba(0, 0, 0, 0.07);
    margin: 40px auto 0;
    width: 100%;
  }
`

const Title = styled(InnerTitle)`
  margin-bottom: 32px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.1rem;
  }
`

const DepositDetails = styled(UserDepositDetails)`
  margin-bottom: 32px;
`

export const UserInformation: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
  ...restProps
}) => {
  const { isWalletConnected } = useWeb3Connection()
  const isBorrowable = useMarketDetails(tokenAddress).market.assetData.borrowingEnabled

  return isWalletConnected ? (
    <Wrapper {...restProps}>
      <Title>My information</Title>
      <DepositDetails tokenAddress={tokenAddress} />
      {isBorrowable && <UserBorrowDetails tokenAddress={tokenAddress} />}
    </Wrapper>
  ) : (
    <></>
  )
}

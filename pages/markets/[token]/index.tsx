import { useRouter } from 'next/router'
import styled from 'styled-components'

import { ButtonDark, ButtonPrimary } from '@/src/components/buttons/Button'
import { MoreActionsDropdown } from '@/src/components/common/MoreActionsDropdown'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { TokenDropdown } from '@/src/components/token/TokenDropdown'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { useUserBorrowsInformationByToken } from '@/src/hooks/presentation/useUserBorrowsInformationByToken'
import { MarketInformation } from '@/src/pagePartials/markets/MarketInformation'
import { ReserveRates } from '@/src/pagePartials/markets/ReserveRates'
import { ReserveStatus } from '@/src/pagePartials/markets/ReserveStatus'
import { UserInformation } from '@/src/pagePartials/markets/UserInformation'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Token } from '@/types/token'

const ActionsWrapper = styled.div`
  --buttons-height: 54px;

  display: flex;
  flex-direction: column;
  margin-bottom: calc(var(--buttons-height) / -2);
  position: relative;
  row-gap: 42px;
  z-index: 5;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 50px;
  }
`

const Buttons = styled.div`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.lightestGray};
  border-radius: 80px;
  box-shadow: 0 100px 80px rgba(0, 0, 0, 0.15), 0 38.5185px 25.4815px rgba(0, 0, 0, 0.0911111),
    0 8.14815px 6.51852px rgba(0, 0, 0, 0.0588889);
  column-gap: 4px;
  display: flex;
  min-height: var(--buttons-height);
  justify-content: center;
  padding: 0 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    column-gap: 10px;
  }
`

const UserConnectedActions: React.FC<{
  tokenAddress: string
  userAddress: string
  tokenSymbol: string
}> = ({ tokenAddress, tokenSymbol, userAddress }) => {
  const router = useRouter()
  const { userHasBorrows } = useUserBorrowsInformationByToken({
    tokenAddress,
    userAddress,
  })

  const items = [
    {
      text: 'Withdraw',
      onClick: () => router.push(`/markets/${tokenSymbol}/withdraw`),
    },
    {
      text: 'Swap',
      onClick: () => router.push(`/swap/${tokenSymbol}`),
    },
    {
      text: 'Strategies',
      onClick: () => router.push(`/strategies/${tokenSymbol}`),
    },
  ]

  if (userHasBorrows) {
    items.push({
      text: 'Repay',
      onClick: () => router.push(`/markets/${tokenSymbol}/repay`),
    })
  }

  return (
    <>
      <MoreActionsDropdown items={items} size="md" variant="neutral" />
      <ButtonDark onClick={() => router.push(`/markets/${tokenSymbol}/borrow`)}>Borrow</ButtonDark>
      <ButtonPrimary onClick={() => router.push(`/markets/${tokenSymbol}/deposit`)}>
        Deposit
      </ButtonPrimary>
    </>
  )
}

const Status = styled(ReserveStatus)`
  margin-bottom: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 40px;
  }
`

const Rates = styled(ReserveRates)`
  margin-bottom: 40px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 64px;
  }
`

function MarketDetails() {
  const tokenInfo = useMarketByURLParam()
  const { address: tokenAddress, symbol: tokenSymbol } = tokenInfo
  const { address: userAddress, connectWallet, isWalletConnected } = useWeb3Connection()
  const router = useRouter()

  const onChange = (token: Token | null) => {
    router.push(`/markets/${token?.symbol}`)
  }

  return (
    <>
      <ActionsWrapper>
        <TokenDropdown activeTokenSymbol={tokenSymbol} onChange={onChange} />
        <Buttons>
          {isWalletConnected && userAddress ? (
            <UserConnectedActions
              tokenAddress={tokenAddress}
              tokenSymbol={tokenSymbol}
              userAddress={userAddress}
            />
          ) : (
            <ButtonPrimary onClick={connectWallet}>Connect wallet</ButtonPrimary>
          )}
        </Buttons>
      </ActionsWrapper>
      <OuterContainer>
        <Status tokenAddress={tokenAddress} />
        <Rates tokenAddress={tokenAddress} />
        <MarketInformation tokenAddress={tokenAddress} />
        <UserInformation tokenAddress={tokenAddress} />
      </OuterContainer>
    </>
  )
}

export default withGenericSuspense(MarketDetails)

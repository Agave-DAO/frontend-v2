import { useRouter } from 'next/router'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ButtonDark, ButtonPrimary } from '@/src/components/buttons/Button'
import { MoreActionsDropdown } from '@/src/components/common/MoreActionsDropdown'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { TokenDropdown } from '@/src/components/token/TokenDropdown'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useMarketDetails } from '@/src/hooks/presentation/useMarketDetails'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { useUserBorrowsInformationByToken } from '@/src/hooks/presentation/useUserBorrowsInformationByToken'
import { MarketInformation } from '@/src/pagePartials/markets/MarketInformation'
import { ReserveRates } from '@/src/pagePartials/markets/ReserveRates'
import { ReserveStatus } from '@/src/pagePartials/markets/ReserveStatus'
import { UserInformation } from '@/src/pagePartials/markets/UserInformation'
import { useModalsContext } from '@/src/providers/modalsProvider'
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
}> = ({ tokenAddress, userAddress }) => {
  const isBorrowable = useMarketDetails(tokenAddress).market.assetData.borrowingEnabled
  const { userHasBorrows } = useUserBorrowsInformationByToken({
    tokenAddress,
    userAddress,
  })
  const { openBorrowRepayModal, openDepositWithdrawModal } = useModalsContext()

  const items = [
    {
      text: 'Withdraw',
      onClick: () => openDepositWithdrawModal({ activeTab: 'withdraw', tokenAddress }),
    },
  ]

  if (userHasBorrows) {
    items.push({
      text: 'Repay',
      onClick: () => openBorrowRepayModal({ activeTab: 'repay', tokenAddress }),
    })
  }

  return (
    <>
      <MoreActionsDropdown items={items} size="md" variant="neutral" />
      {isBorrowable && (
        <ButtonDark onClick={() => openBorrowRepayModal({ activeTab: 'borrow', tokenAddress })}>
          Borrow
        </ButtonDark>
      )}
      <ButtonPrimary
        onClick={() => openDepositWithdrawModal({ tokenAddress, activeTab: 'deposit' })}
      >
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

const MarketDetails: React.FC = withGenericSuspense(
  () => {
    const tokenInfo = useMarketByURLParam()
    const { address: tokenAddress, symbol: tokenSymbol } = useMemo(() => tokenInfo, [tokenInfo])
    const { address: userAddress, connectWallet, isWalletConnected } = useWeb3Connection()
    const router = useRouter()

    const onChange = (token: Token | null) => {
      router.push(`/markets/${token?.symbol}`, undefined, {
        shallow: true,
        scroll: false,
      })
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
  },
  () => (
    <>
      <ActionsWrapper>
        <SkeletonLoading
          style={{
            minWidth: '0',
            maxWidth: '58px',
            width: '58px',
            height: '58px',
            borderRadius: '16px',
          }}
        />
        <SkeletonLoading style={{ maxWidth: '360px', height: '54px', borderRadius: '80px' }} />
      </ActionsWrapper>
      <OuterContainer>
        <SkeletonLoading
          style={{
            borderRadius: '16px',
            marginBottom: '40px',
            padding: '24px 16px 16px',
          }}
        >
          <SkeletonLoading
            animate={false}
            style={{
              borderRadius: '50%',
              height: '200px',
              margin: '56px auto 32px',
              width: '200px',
            }}
          />
          <div style={{ display: 'grid', rowGap: '6px' }}>
            {Array.from({ length: 2 }).map((item, index) => (
              <SkeletonLoading
                animate={false}
                key={`list_${index}`}
                style={{ height: '53px', borderRadius: '6px' }}
              />
            ))}
          </div>
        </SkeletonLoading>
        <SkeletonLoading
          style={{
            borderRadius: '16px',
            padding: '16px',
          }}
        >
          <div style={{ display: 'grid', rowGap: '6px' }}>
            {Array.from({ length: 3 }).map((item, index) => (
              <SkeletonLoading
                animate={false}
                key={`list_${index}`}
                style={{ height: '53px', borderRadius: '6px' }}
              />
            ))}
          </div>
        </SkeletonLoading>
      </OuterContainer>
    </>
  ),
)
// generate the actions html files for each market
export async function getStaticPaths() {
  // Get the list of markets
  const markets = agaveTokens.reserveTokens

  // Generate the paths for each market (symbol & address)
  const paths = markets.flatMap(({ address, symbol }) => {
    return [
      { params: { token: symbol } },
      { params: { token: symbol } },
      { params: { token: symbol } },
      { params: { token: symbol } },
      { params: { token: address } },
      { params: { token: address } },
      { params: { token: address } },
      { params: { token: address } },
    ]
  })

  return { paths, fallback: true }
}

export async function getStaticProps({ params }: { params: { token: string; action: string } }) {
  const { token } = params
  // TODO - we need to add the tokens for both market versions here
  const tokenExists = agaveTokens.reserveTokens.find(
    (t) => t.symbol === token || t.address === token,
  )

  if (!tokenExists) {
    return { notFound: true }
  }

  // Pass the market parameter to the component
  return { props: { token: params.token } }
}

export default MarketDetails

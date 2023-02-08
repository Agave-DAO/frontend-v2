import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import WithdrawToken from '@/src/components/token/Withdraw'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory } from '@/types/generated/typechain'

function WithdrawImpl() {
  const tokenInfo = useMarketByURLParam()
  const agToken = agaveTokens.getTokenByFieldAndValue({ symbol: `ag${tokenInfo.symbol}` })

  if (!agToken) {
    throw Error('There is not token info for the token address provided')
  }

  const { address: userAddress } = useWeb3ConnectedApp()
  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')

  return (
    <>
      <BaseTitle>
        Withdraw <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <WithdrawToken
        action={(amount) => lendingPool.withdraw(tokenInfo.address, amount, userAddress)}
        tokenAddress={agToken.address}
      />
    </>
  )
}

function Withdraw() {
  return (
    <RequiredConnection>
      <WithdrawImpl />
    </RequiredConnection>
  )
}

export default withGenericSuspense(Withdraw)

import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import DepositToken from '@/src/components/token/Deposit'
import { contracts } from '@/src/contracts/contracts'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { DepositInfo } from '@/src/pagePartials/markets/DepositInfo'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory } from '@/types/generated/typechain'

function DepositImpl() {
  const { address: userAddress, appChainId } = useWeb3ConnectedApp()
  const tokenInfo = useMarketByURLParam()

  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const lendingPoolAddress = contracts['AgaveLendingPool'].address[appChainId]

  return (
    <>
      <BaseTitle>
        Deposit <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <DepositToken
        action={(amount) => lendingPool.deposit(tokenInfo.address, amount, userAddress, 0)}
        spenderAddress={lendingPoolAddress}
        tokenAddress={tokenInfo.address}
      />
    </>
  )
}

function Deposit() {
  return (
    <RequiredConnection>
      <>
        <DepositInfo />
        <DepositImpl />
      </>
    </RequiredConnection>
  )
}

export default withGenericSuspense(Deposit)

import { useRouter } from 'next/router'

import { BigNumber, ethers } from 'ethers'
import { isAddress } from 'ethers/lib/utils'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import BorrowToken from '@/src/components/token/Borrow'
import DepositToken from '@/src/components/token/Deposit'
import WithdrawToken from '@/src/components/token/Withdraw'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { contracts } from '@/src/contracts/contracts'
import useGetAssetsPriceInDAI from '@/src/hooks/agave/useGetAssetsPriceInDAI'
import useGetUserAccountData from '@/src/hooks/agave/useGetUserAccountData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { AgaveLendingABI__factory } from '@/types/generated/typechain'

type Props = {
  address: string
  tokenAddress: string
}

function MarketImp({ address, tokenAddress }: Props) {
  const { appChainId } = useWeb3Connection()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const agToken = agaveTokens.getTokenByFieldAndValue({ symbol: `ag${tokenInfo.symbol}` })

  if (!isAddress(tokenAddress as string)) {
    throw Error('Address provided is not a valid address')
  }

  if (!tokenInfo || !agToken) {
    throw Error('There is not token info for the token address provided')
  }

  const lendingPoolAddress = contracts['LendingPool'].address[appChainId]
  const lendingPool = useContractInstance(AgaveLendingABI__factory, 'LendingPool')

  const [{ data: userAccountData }] = useGetUserAccountData(address || ethers.constants.AddressZero)
  const [{ data: assetPricesInDAI }] = useGetAssetsPriceInDAI([
    '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
  ])

  const availableToBorrowDAI = userAccountData?.[0].availableBorrowsETH // 0.0001 eth
  const tokenPrice = assetPricesInDAI?.[0]?.[0] // 1330 usd
  const maxBorrow =
    availableToBorrowDAI?.mul(BigNumber.from(10).pow(18)).div(tokenPrice || BigNumber.from(1)) ||
    ZERO_BN

  if (!address) {
    return <div>Connect wallet before continue</div>
  }

  return (
    <div>
      <DepositToken
        action={(amount) => lendingPool.deposit(tokenAddress, amount, address, 0)}
        spenderAddress={lendingPoolAddress}
        tokenAddress={tokenAddress}
      />

      <WithdrawToken
        action={(amount) => lendingPool.withdraw(tokenAddress, amount, address)}
        tokenAddress={agToken.address}
      />

      <BorrowToken
        action={(amount) => lendingPool.borrow(tokenAddress, amount, 2, 0, address)}
        maxValue={
          tokenInfo.decimals < 18
            ? maxBorrow.div(BigNumber.from(10).pow(18 - tokenInfo.decimals))
            : maxBorrow
        }
        tokenAddress={tokenAddress}
      />

      <DepositToken
        action={(amount) => lendingPool.repay(tokenAddress, amount, 2, address)}
        label="Repay"
        spenderAddress={lendingPoolAddress}
        tokenAddress={tokenAddress}
      />
    </div>
  )
}

function Market() {
  const { address } = useWeb3Connection()
  const { query } = useRouter()
  const token = query.token as string

  if (!address) {
    return <div>Connect your wallet before continue</div>
  }

  return <MarketImp address={address} tokenAddress={token} />
}

export default withGenericSuspense(Market)

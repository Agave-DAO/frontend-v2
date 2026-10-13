import { JsonRpcProvider } from '@ethersproject/providers'

export function getTransactionSigner(library: JsonRpcProvider, account: string, chainId: number) {
  const signer = library.getSigner(account)
  const sendTransaction = signer.sendTransaction.bind(signer)
  // Recheck every write: approval confirmation can outlive the wallet selection.
  signer.sendTransaction = async (transaction) => {
    const [liveChainId, accounts] = await Promise.all([
      library.send('eth_chainId', []),
      library.send('eth_accounts', []),
    ])
    if (
      Number(liveChainId) !== chainId ||
      !Array.isArray(accounts) ||
      typeof accounts[0] !== 'string' ||
      accounts[0].toLowerCase() !== account.toLowerCase()
    ) {
      throw new Error('Wallet account or network changed. Please restart the action.')
    }
    return sendTransaction({ ...transaction, chainId })
  }
  return signer
}

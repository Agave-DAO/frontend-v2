import { Web3Provider } from '@ethersproject/providers'

import { getTransactionSigner } from './transactionSigner'

const account = '0x0000000000000000000000000000000000000001'
const otherAccount = '0x0000000000000000000000000000000000000002'

function wallet() {
  const state = { chain: '0x64', accounts: [account] }
  const sendTransaction = jest.fn().mockResolvedValue({ hash: '0x123' })
  const signer = { sendTransaction }
  const getSigner = jest.fn().mockReturnValue(signer)
  const library = {
    getSigner,
    send: jest.fn(async (method: string) =>
      method === 'eth_chainId' ? state.chain : state.accounts,
    ),
  } as unknown as Web3Provider
  return { state, sendTransaction, getSigner, library }
}

describe('transaction signer', () => {
  it('binds writes to the expected wallet account', async () => {
    const { getSigner, library, sendTransaction } = wallet()
    const signer = getTransactionSigner(library, account, 100)
    const transaction = { to: otherAccount }
    await signer.sendTransaction(transaction)
    expect(getSigner).toHaveBeenCalledWith(account)
    expect(sendTransaction).toHaveBeenCalledWith({ ...transaction, chainId: 100 })
  })

  it.each(['account', 'chain', 'disconnect'])(
    'rejects a %s change after a previous write',
    async (change) => {
      const { library, sendTransaction, state } = wallet()
      const signer = getTransactionSigner(library, account, 100)
      await signer.sendTransaction({ to: otherAccount })
      if (change === 'account') state.accounts = [otherAccount, account]
      if (change === 'chain') state.chain = '0x1'
      if (change === 'disconnect') state.accounts = []
      await expect(signer.sendTransaction({ to: otherAccount })).rejects.toThrow(
        'Wallet account or network changed',
      )
      expect(sendTransaction).toHaveBeenCalledTimes(1)
    },
  )

  it('fails closed if wallet state cannot be read', async () => {
    const { library, sendTransaction } = wallet()
    jest.spyOn(library, 'send').mockRejectedValue(new Error('Wallet disconnected'))
    const signer = getTransactionSigner(library, account, 100)
    await expect(signer.sendTransaction({ to: otherAccount })).rejects.toThrow(
      'Wallet disconnected',
    )
    expect(sendTransaction).not.toHaveBeenCalled()
  })
})

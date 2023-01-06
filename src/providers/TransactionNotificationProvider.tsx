import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { TransactionResponse } from '@ethersproject/providers'
import toast from 'react-hot-toast'

import { notify } from '@/src/components/toast/Toast'
import { usePersistedState } from '@/src/hooks/usePersistedState'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ChainsValues } from '@/types/chains'
import { ToastStates } from '@/types/toast'

type TransactionStorageItem = {
  chainId: ChainsValues
  address: string
  txHash: string
}

type TransactionContextValue = {
  notifyTxMined: (txHash: string, isSuccess?: boolean) => void
  notifyWaitingForSignature: () => void
  notifyWaitingForTxMined: (txHash: string) => void
  notifyRejectSignature: (msg: string) => void
  state: TransactionStorageItem[]
}

const TransactionContext = createContext<TransactionContextValue | undefined>(undefined)

const TRANSACTIONS_STORE = 'pending-transactions'

export const TransactionNotificationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { address, appChainId, getExplorerUrl, readOnlyAppProvider } = useWeb3Connection()
  const [isRan, setIsRan] = useState(false)

  const initialState: TransactionStorageItem[] = []

  const [transactionStore, setTransactionStore] = usePersistedState(
    TRANSACTIONS_STORE,
    initialState,
  )

  const removeTxFromStorage = useCallback(
    (txHash: string) => {
      transactionStore &&
        setTransactionStore(
          transactionStore.filter((tx: TransactionStorageItem) => tx.txHash !== txHash),
        )
    },
    [setTransactionStore, transactionStore],
  )

  const notifyWaitingForSignature = () => {
    notify({
      type: ToastStates.waiting,
      message: 'Waiting for signature',
      id: 'waitingForSignature',
    })
  }

  const notifyRejectSignature = (msg: string) => {
    toast.remove('waitingForSignature')
    notify({ type: ToastStates.failed, message: msg })
  }

  const notifyWaitingForTxMined = (txHash: string) => {
    toast.remove('waitingForSignature')
    transactionStore &&
      address &&
      setTransactionStore([...transactionStore, { chainId: appChainId, address, txHash }])

    notify({
      type: ToastStates.waiting,
      explorerUrl: getExplorerUrl(txHash),
      id: txHash,
    })
  }

  const notifyTxMined = useCallback(
    (txHash: string, isSuccess?: boolean) => {
      if (isSuccess) {
        notify({
          type: ToastStates.success,
          explorerUrl: getExplorerUrl(txHash),
          id: txHash,
        })

        removeTxFromStorage(txHash)
      } else {
        notify({
          type: ToastStates.failed,
          explorerUrl: getExplorerUrl(txHash),
          id: txHash,
        })

        removeTxFromStorage(txHash)
      }
    },
    [getExplorerUrl, removeTxFromStorage],
  )

  // Check if there are previous tx on the storage
  useEffect(() => {
    if (!address || !appChainId || isRan) return
    setIsRan(true)
    const recoverTxStatus = async () => {
      // recover txHashes from storage
      const txsStatus: Promise<TransactionResponse>[] = (transactionStore || [])
        .filter((tx) => address === tx.address && appChainId === tx.chainId && tx.txHash)
        .map((tx) => readOnlyAppProvider?.getTransaction(tx.txHash))

      // check txHashes status
      const hashes = (await Promise.all(txsStatus)).map((status) => {
        const { blockNumber } = status
        if (blockNumber) {
          removeTxFromStorage(status.hash)
          return null
        }
        return status.hash
      })

      // get not mined txHashes
      const pendingHashes = hashes.filter((txHash) => txHash !== null)
      if (pendingHashes.length > 0) {
        notify({
          type: ToastStates.waiting,
          message: `There are ${pendingHashes.length} pending transactions`,
        })
      }

      // wait for txs to be executed
      const promises = pendingHashes.map(async (txHash) => {
        const res = await readOnlyAppProvider.waitForTransaction(txHash as string, 1)
        notifyTxMined(txHash as string, res.status === 1)
      })

      await Promise.allSettled(promises)
    }

    recoverTxStatus()
  }, [
    address,
    appChainId,
    isRan,
    notifyTxMined,
    readOnlyAppProvider,
    removeTxFromStorage,
    transactionStore,
  ])

  const values: TransactionContextValue = {
    state: transactionStore as TransactionStorageItem[],
    notifyTxMined,
    notifyWaitingForSignature,
    notifyWaitingForTxMined,
    notifyRejectSignature,
  }

  return <TransactionContext.Provider value={values}>{children}</TransactionContext.Provider>
}

export function useTransactionNotification() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error(
      'useTransactionNotification must be used within a TransactionNotificationProvider',
    )
  }
  return context
}

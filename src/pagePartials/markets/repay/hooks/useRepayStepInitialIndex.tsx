import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { useGetAllowance } from '@/src/hooks/queries/useGetAllowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory } from '@/types/generated/typechain'

// TODO: This is a duplicate of useDepositStepInitialIndex.tsx. Refactor to a single hook.
export const useRepayStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const [initialStepIndex, setInitialStepIndex] = useState(0)

  /**
   * Allowance
   */
  const allowancePromise = useGetAllowance({
    from: userAddress,
    to: agaveLending.address,
    tokenAddress,
  })

  useEffect(() => {
    if (typeof allowancePromise !== 'undefined') {
      allowancePromise
        .then((allowance) => {
          if (allowance.gt(Zero)) {
            if (allowance.gte(BigNumber.from(amount))) {
              setInitialStepIndex(1)
            }
          }
        })
        .catch(() => {
          setInitialStepIndex(0)
        })
    }
  }, [allowancePromise, amount])

  return initialStepIndex
}

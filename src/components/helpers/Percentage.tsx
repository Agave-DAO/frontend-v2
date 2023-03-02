import { BigNumber } from 'ethers'

import { formatPercentage } from '@/src/utils/common'

export const Percentage = ({ decimals, value }: { value: BigNumber; decimals: number }) => (
  <>{formatPercentage(value, decimals)}</>
)

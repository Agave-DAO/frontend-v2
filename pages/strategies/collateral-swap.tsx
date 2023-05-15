/**
 * IMPORTANT: DO NOT DELETE THIS FILE
 * Due to the limitations of static files + IPFS we can't use the usual approach
 * of using the vault address as part of the param in the URL
 * (as they are dynamic).
 */
import { NextPage } from 'next'

import { CollateralSwapContent } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapContent'

const CollateralSwap: NextPage = () => {
  return <CollateralSwapContent />
}

export default CollateralSwap

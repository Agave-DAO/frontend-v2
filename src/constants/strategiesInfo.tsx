import { ReactElement } from 'react'

import { strategies } from './strategies.json'
import { CollateralSwap } from '@/src/components/assets/CollateralSwap'
import { Strategy } from '@/types/strategy'

export const strategyIcon: Record<Strategy['slug'], ReactElement> = {
  'collateral-swap': <CollateralSwap />,
}

export const strategiesInfo: Strategy[] = strategies.map((strategy) => {
  if (!strategyIcon[strategy.slug]) {
    throw new Error(`Missing icon for ${strategy.slug}`)
  }

  return {
    ...strategy,
    icon: strategyIcon[strategy.slug],
  }
})

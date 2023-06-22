import { ReactElement } from 'react'

import strategiesJSON from './strategies.json'
import { CollateralSwap } from '@/src/components/assets/CollateralSwap'
import { Strategy } from '@/types/strategy'

const strategies = strategiesJSON?.strategies

export const strategyIcon: Record<Strategy['slug'], ReactElement> = {
  'collateral-swap': <CollateralSwap />,
}

export const strategiesInfo = strategies.map((strategy): Strategy => {
  if (!strategyIcon[strategy.slug]) {
    throw new Error(`Missing icon for ${strategy.slug}`)
  }

  return {
    ...strategy,
    icon: strategyIcon[strategy.slug],
  }
})

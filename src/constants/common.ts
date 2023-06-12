import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'

import { WEI_PER_ETHER } from '@/src/constants/bigNumber'

export const appName = process.env.NEXT_PUBLIC_APP_NAME || 'letsHopeWeCanAvoidNameClashingThen'
export const cookiesWarningEnabled =
  process.env.NEXT_PUBLIC_COOKIES_WARNING_ENABLED === 'true' || ''
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

export const NATIVE_DECIMALS = 18
export const DISPLAY_DECIMALS = 2
export const TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL = 10_000
export const MIN_SAFE_HEALTH_FACTOR = BigNumber.from(1200)
export const MAX_HEALTH_FACTOR_VALUE_TO_RENDER = BigNumber.from(999)
export const MINIMUM_NATIVE_RESERVE = WEI_PER_ETHER.div(50)
export const ADDRESS_ZERO = AddressZero

export const chartColors = [
  '#2775CA',
  '#69C993',
  '#BCF298',
  '#40B3B3',
  '#F9F871',
  '#9BEFD7',
  '#4486B5',
  '#D1DDDC',
  '#647C77',
  '#92DE95',
  '#40B390',
  '#019D8B',
  '#006268',
  '#0E3940',
]

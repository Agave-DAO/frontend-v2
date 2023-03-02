import { BigNumber } from '@ethersproject/bignumber'

export const appName = process.env.NEXT_PUBLIC_APP_NAME || 'letsHopeWeCanAvoidNameClashingThen'
export const cookiesWarningEnabled =
  process.env.NEXT_PUBLIC_COOKIES_WARNING_ENABLED === 'true' || ''
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

export const NATIVE_DECIMALS = 18
export const DISPLAY_DECIMALS = 2
export const TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL = 10_000
export const MIN_SAFE_HEALTH_FACTOR = BigNumber.from(1200)
export const MAX_HEALTH_FACTOR_VALUE_TO_RENDER = BigNumber.from(10)

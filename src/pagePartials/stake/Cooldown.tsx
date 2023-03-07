import { useState } from 'react'

import { futureDateToCooldownPeriod } from '@/src/utils/common'
import { useInterval } from '@/src/utils/useInterval'

export const Cooldown = ({ targetDate }: { targetDate: Date }) => {
  const [{ days, hours, minutes }, setCooldown] = useState(
    futureDateToCooldownPeriod(targetDate, new Date()),
  )

  useInterval(() => {
    setCooldown(futureDateToCooldownPeriod(targetDate, new Date()))
  }, 1000 * 60)

  return <span>{`${days}d ${hours}h ${minutes}m`}</span>
}

import { useState } from 'react'
import styled from 'styled-components'

import { futureDateToCooldownPeriod } from '@/src/utils/common'
import { useInterval } from '@/src/utils/useInterval'

const Clock = () => (
  <svg fill="none" height="14" viewBox="0 0 14 14" width="14" xmlns="http://www.w3.org/2000/svg">
    <path
      clipRule="evenodd"
      d="M7 1.27273C3.83691 1.27273 1.27273 3.83691 1.27273 7C1.27273 10.1631 3.83691 12.7273 7 12.7273C10.1631 12.7273 12.7273 10.1631 12.7273 7C12.7273 3.83691 10.1631 1.27273 7 1.27273ZM0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7Z"
      fill="white"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M7.58331 2.33301C7.90547 2.33301 8.16662 2.6464 8.16662 3.03299V6.80029L10.1774 8.00678C10.4656 8.17967 10.5824 8.60014 10.4383 8.94591C10.2942 9.29169 9.94384 9.43184 9.65569 9.25896L7.32245 7.85899C7.12483 7.74041 7 7.49803 7 7.2329V3.03299C7 2.6464 7.26116 2.33301 7.58331 2.33301Z"
      fill="white"
      fillRule="evenodd"
    />
  </svg>
)

const Wrapper = styled.span`
  align-items: center;
  column-gap: 8px;
  display: flex;
`

const Time = styled.span`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
`

export const Cooldown: React.FC<{ targetDate: Date }> = ({ targetDate, ...restProps }) => {
  const [{ days, hours, minutes }, setCooldown] = useState(
    futureDateToCooldownPeriod(targetDate, new Date()),
  )

  useInterval(() => {
    setCooldown(futureDateToCooldownPeriod(targetDate, new Date()))
  }, 1000 * 60)

  return (
    <Wrapper {...restProps}>
      <Clock />
      <Time>{`${days}d ${hours}h ${minutes}m`}</Time>
    </Wrapper>
  )
}

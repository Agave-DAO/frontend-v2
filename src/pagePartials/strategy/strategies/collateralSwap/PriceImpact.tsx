import styled from 'styled-components'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { InlineLoading as BaseInlineLoading } from '@/src/components/loading/InlineLoading'
import { usePriceImpact } from '@/src/pagePartials/strategy/strategies/collateralSwap/hooks/usePriceImpact'

const InlineLoading = styled(BaseInlineLoading)`
  color: ${({ theme: { colors } }) => colors.darkerGray} !important;
`
export const PriceImpact = withGenericSuspense(
  () => {
    const priceImpact = usePriceImpact()

    return <>{`${priceImpact ? priceImpact.toFixed(2) : '0.00'}%`}</>
  },
  () => <InlineLoading text="processing..." />,
)

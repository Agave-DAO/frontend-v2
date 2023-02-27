import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useGetQueryParam } from '@/src/hooks/useGetQueryParam'

export const usePageModeParam = (): InterestRateMode => {
  // Checking if the borrow mode is stable or variable (return Variable as default).
  return useGetQueryParam('mode') === InterestRateMode[InterestRateMode.stable]
    ? InterestRateMode.stable
    : InterestRateMode.variable
}

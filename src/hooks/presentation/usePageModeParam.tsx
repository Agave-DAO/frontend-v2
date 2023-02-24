import { useGetQueryParam } from '@/src/hooks/useGetQueryParam'

// TODO: remove this enum as it will be added as part of PR #120 under the name `BorrowRate`
export enum InterestRateMode {
  stable = 1,
  variable,
}

export const usePageModeParam = (): InterestRateMode => {
  // Checking if the borrow mode is stable or variable (return Variable as default).
  return useGetQueryParam('mode') === InterestRateMode[InterestRateMode.stable]
    ? InterestRateMode.stable
    : InterestRateMode.variable
}

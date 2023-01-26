import { BigNumber } from '@ethersproject/bignumber'

import { calculateRewards } from './calculateRewards'

describe('calculateRewards', function () {
  ;[
    [1, 1, 100, 40, 60, 100],
    [1, 1, 99, 39, 59, 98],
    [1, 1, 98, 39, 58, 97],
    [1, 1, 97, 38, 58, 96],
    [1, 1, 96, 38, 57, 95],
    [1, 1, 95, 38, 57, 95],
    [1, 1, 94, 37, 56, 93],
    [1, 1, 93, 37, 55, 92],
    [1, 1, 92, 36, 55, 91],
    [1, 1, 91, 36, 54, 90],
    [1, 1, 90, 36, 54, 90],
  ]
    .map(testCaseToTestParams)
    .map(([agvePrice, gnoPrice, rewardsBalance, expected]) => {
      it(`should return a 'totalValue' of ${expected.totalValue.toString()} for:
    { 
      agvePrice: ${agvePrice.toString()},
      gnoPrice: ${gnoPrice.toString()},
      rewardsBalance: ${rewardsBalance.toString()}
    }`, () => {
        expect(calculateRewards({ agvePrice, gnoPrice, rewardsBalance })).toEqual(expected)
      })
    })
})

function testCaseToTestParams(testCase: Array<number>) {
  const [agvePrice, gnoPrice, rewardsBalance, agveValue, gnoValue, totalValue] = testCase

  return [
    BigNumber.from(agvePrice),
    BigNumber.from(gnoPrice),
    BigNumber.from(rewardsBalance),
    {
      agveValue: BigNumber.from(agveValue),
      gnoValue: BigNumber.from(gnoValue),
      totalValue: BigNumber.from(totalValue),
    },
  ] as const
}

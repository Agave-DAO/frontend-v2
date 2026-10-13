import { BigNumber } from '@ethersproject/bignumber'

import { calculateRewards } from './calculateRewards'

describe('calculateRewards', function () {
  it('keeps token and price precision for an odd reward amount', () => {
    const reward = BigNumber.from('1000000000000000001')
    const agvePrice = BigNumber.from('2000000000000000000')
    const gnoPrice = BigNumber.from('4000000000000000000')

    expect(calculateRewards({ agvePrice, gnoPrice, rewardsBalance: reward })).toEqual({
      agveValue: BigNumber.from('1000000000000000001000000000000000000'),
      gnoValue: BigNumber.from('2000000000000000002000000000000000000'),
      totalValue: BigNumber.from('3000000000000000003000000000000000000'),
    })
  })
  ;[
    [1, 1, 100, 50, 50, 100],
    [1, 1, 99, 49, 49, 98],
    [1, 1, 98, 49, 49, 98],
    [1, 1, 97, 48, 48, 96],
    [1, 1, 96, 48, 48, 96],
    [1, 1, 95, 47, 47, 94],
    [1, 1, 94, 47, 47, 94],
    [1, 1, 93, 46, 46, 92],
    [1, 1, 92, 46, 46, 92],
    [1, 1, 91, 45, 45, 90],
    [1, 1, 90, 45, 45, 90],
    [2, 4, 1, 1, 2, 3],
    [2, 4, 3, 3, 6, 9],
    [2, 4, 0, 0, 0, 0],
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

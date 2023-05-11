import gql from 'graphql-tag'

export const BALANCER_V2_POOL = gql`
  query BalancerV2Pool {
    pool(id: "0x388cae2f7d3704c937313d990298ba67d70a3709000200000000000000000026") {
      id
      totalLiquidity
      totalShares
      tokens {
        balance
        symbol
      }
    }
  }
`

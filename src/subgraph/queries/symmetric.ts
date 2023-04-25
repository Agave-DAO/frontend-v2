import gql from 'graphql-tag'

// TODO v1 symmetric, is reliable??. In this graph liquidity
export const SYMMETRIC_V1_POOL = gql`
  query SymmetricV2Pool {
    pool(id: "0x870bb2c024513b5c9a69894dcc65fb5c47e422f3000200000000000000000014") {
      id
      totalShares
      tokens {
        balance
        symbol
      }
    }
  }
`

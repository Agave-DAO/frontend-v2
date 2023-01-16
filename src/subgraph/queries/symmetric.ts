import gql from 'graphql-tag'

// TODO v1 symmetric, is reliable??. In this graph liquidity
export const SYMMETRIC_V1_POOL = gql`
  query SymmetricV1Pool {
    pools(where: { id: "0x34fa946a20e65cb1ac466275949ba382973fde2b" }) {
      id
      liquidity
      totalShares
    }
  }
`

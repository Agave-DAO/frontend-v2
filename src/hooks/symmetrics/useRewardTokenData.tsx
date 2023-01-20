import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export const useRewardTokenData = () => {
  const { appChainId } = useWeb3Connection()

  const gqlSymm = getSubgraphSdkByNetwork(appChainId, SubgraphName.SymmetricV1)

  const { data: rewardTokenData } = gqlSymm.useSymmetricV1Pool(undefined, {
    refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
  })

  return rewardTokenData
}

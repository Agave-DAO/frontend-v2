import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export const useGetRewardTokenData = () => {
  const { appChainId } = useWeb3Connection()

  const gqlSymm = getSubgraphSdkByNetwork(appChainId, SubgraphName.SymmetricV1)

  const { data: rewardTokenData } = gqlSymm.useSymmetricV1Pool(undefined, {
    refreshInterval: 10_000,
  })

  return rewardTokenData
}

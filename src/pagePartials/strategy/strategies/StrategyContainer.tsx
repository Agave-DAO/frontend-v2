import { useRouter } from 'next/router'
import { FC, PropsWithChildren } from 'react'
import styled from 'styled-components'

import { BaseTitle } from '@/src/components/text/BaseTitle'
import { StrategiesDropdown } from '@/src/pagePartials/strategy/common/StrategiesDropdown'
import { Strategy } from '@/types/strategy'

const Title = styled(BaseTitle)`
  margin: 0 0 40px;
  text-transform: capitalize;
`

export const StrategyContainer: FC<
  PropsWithChildren<{ strategy: Strategy['slug']; vaultAddress: string }>
> = ({ children, strategy, vaultAddress }) => {
  const router = useRouter()

  return (
    <>
      <Title>Strategies</Title>
      <StrategiesDropdown
        onChange={(selectedStrategy) =>
          router.push(`/strategies/${selectedStrategy}?vault=${vaultAddress}`)
        }
        strategy={strategy}
      />
      {children}
    </>
  )
}

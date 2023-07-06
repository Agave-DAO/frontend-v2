import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, PropsWithChildren } from 'react'
import styled from 'styled-components'

import { ButtonGoTo } from '@/src/components/buttons/ButtonGoTo'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { StrategiesDropdown } from '@/src/pagePartials/strategy/common/StrategiesDropdown'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'
import { Strategy } from '@/types/strategy'

const Title = styled(BaseTitle)`
  margin: 0 0 40px;
  text-transform: capitalize;
`

const Wrapper = styled.div`
  min-height: 500px;
`

export const StrategyContainer: FC<PropsWithChildren<{ strategy: Strategy['slug'] }>> = ({
  children,
  strategy,
}) => {
  const router = useRouter()
  const { vaultAddress } = useVaultModalContext()

  return (
    <Wrapper>
      <Link href={`/strategies/vault-details?vault=${vaultAddress}`}>{'<'} Back to vault</Link>
      <br />
      <Title>Strategies</Title>
      <StrategiesDropdown
        onChange={(selectedStrategy) =>
          router.push(`/strategies/${selectedStrategy}?vault=${vaultAddress}`)
        }
        strategy={strategy}
      />
      {children}
    </Wrapper>
  )
}

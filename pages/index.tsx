import type { NextPage } from 'next'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { Code } from '@/src/components/text/Code'
import { useWeb3ConnectedApp, useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Card = styled(BaseCard)`
  min-height: 300px;
`

const Address: React.FC = () => {
  const { address } = useWeb3ConnectedApp()

  return address ? <Code>{address}</Code> : null
}

const Home: NextPage = () => {
  const { isAppConnected } = useWeb3Connection()

  return (
    <>
      <BaseTitle>Welcome to BootNode-web3-Next.js!</BaseTitle>
      <Card>
        <BaseParagraph>
          Get started by editing <Code>pages/index.tsx</Code>
        </BaseParagraph>
        {isAppConnected && (
          <BaseParagraph>
            Your wallet address: <Address />
          </BaseParagraph>
        )}
      </Card>
    </>
  )
}

export default Home

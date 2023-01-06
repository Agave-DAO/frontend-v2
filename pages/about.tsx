import type { NextPage } from 'next'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { Code } from '@/src/components/text/Code'

const Card = styled(BaseCard)`
  min-height: 300px;
`

const About: NextPage = () => {
  return (
    <>
      <BaseTitle>About</BaseTitle>
      <Card>
        <BaseParagraph>
          Get started by editing <Code>pages/about.tsx</Code>
        </BaseParagraph>
      </Card>
    </>
  )
}

export default About

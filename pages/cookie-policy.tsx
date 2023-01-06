import type { NextPage } from 'next'

import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { Code } from '@/src/components/text/Code'

const About: NextPage = () => {
  return (
    <>
      <BaseTitle>Cookie Policy</BaseTitle>
      <BaseParagraph>
        Get started by editing <Code>pages/cookie-policy.tsx</Code>
      </BaseParagraph>
    </>
  )
}

export default About

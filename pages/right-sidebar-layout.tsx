import Link from 'next/link'
import { ReactElement } from 'react'
import styled from 'styled-components'

import type { NextPageWithLayout } from '@/pages/_app'
import { BaseCard } from '@/src/components/common/BaseCard'
import { SidebarLayout } from '@/src/components/layout/SidebarLayout'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'

const Card = styled(BaseCard)`
  min-height: 300px;
`

const LeftSidebarLayout2: NextPageWithLayout = () => {
  return (
    <>
      <BaseTitle>Alternative Layout v2</BaseTitle>
      <Card>
        <BaseParagraph>Nothing should change in the sidebar / menu.</BaseParagraph>
        <BaseParagraph>
          <Link href="/examples">Go back!</Link>
        </BaseParagraph>
      </Card>
    </>
  )
}

LeftSidebarLayout2.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout sidebarPlacement="right">{page}</SidebarLayout>
}

export default LeftSidebarLayout2

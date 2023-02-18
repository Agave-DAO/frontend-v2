import { NextPage } from 'next'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseTitle } from '@/src/components/text/BaseTitle'

const Card = styled(BaseCard)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Markets: NextPage = () => {
  return (
    <>
      <BaseTitle>Stake</BaseTitle>
      <Card>Stake goes here</Card>
    </>
  )
}

export default Markets

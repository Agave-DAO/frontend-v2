import { NextPage } from 'next'
import { useState } from 'react'
import styled from 'styled-components'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { BaseParagraph as Paragraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { DepositRedeem } from '@/src/pagePartials/sdai/DepositRedeem'
import { InfoTable } from '@/src/pagePartials/sdai/InfoTable'
import { DepositRedeemTabs } from '@/types/modal'

const MandatoryConnection = styled(RequiredConnection)`
  height: 300px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 500px;
  }
`

const Title = styled(BaseTitle)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 23px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-top: 0;
  }
`

const BigContainer = styled(OuterContainer)`
  padding-bottom: 100px;
  padding-top: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 48px;
    padding-bottom: 40px;
  }
`

const Sdai: NextPage = () => {
  const [tab, setTab] = useState<DepositRedeemTabs>('deposit')

  return (
    <>
      <Title>sDAI</Title>
      <Paragraph>
        sDAI is similar to DAI but with the added benefit of earning interest. You can use it just
        like DAI - own, transfer, and use it in the DeFi ecosystem. Swapping between sDAI and DAI
        incurs no additional costs and no slippafe as it is deposited or withdrawn from the DSR
        contract.
      </Paragraph>
      <InfoTable />
      <MandatoryConnection>
        <BigContainer>
          <DepositRedeem activeTab={tab} setTab={setTab} />
        </BigContainer>
      </MandatoryConnection>
    </>
  )
}

export default Sdai

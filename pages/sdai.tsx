import { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { BaseParagraph as Paragraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { DepositRedeem } from '@/src/pagePartials/sdai/DepositRedeem'
import { InfoTable } from '@/src/pagePartials/sdai/InfoTable'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { DepositRedeemTabs } from '@/types/modal'

const MandatoryConnection = styled(RequiredConnection)`
  height: 300px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 500px;
  }
`

const TitleWrapper = styled(BaseTitle)`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-top: 23px;
  width: 20vw;
  height: 5rem;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-top: 0;
  }
`

const Title = styled(BaseTitle)`
  margin: 0px 2rem;
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
  const [error, setError] = useState(false)
  const { savingsToken } = useAgaveTokens()
  return (
    <>
      <TitleWrapper>
        {savingsToken.logoURI && !error ? (
          <Image
            alt={savingsToken.symbol}
            className="Logo"
            height={40}
            onError={() => setError(true)}
            src={savingsToken.logoURI}
            width={40}
          />
        ) : null}
        <Title>sDAI</Title>
      </TitleWrapper>
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

import { NextPage } from 'next'
import { useState } from 'react'
import styled from 'styled-components'

import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { OuterContainer } from '@/src/components/layout/OuterContainer'
import { BaseParagraph as Paragraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useTokenInfo } from '@/src/hooks/useTokenInfo'
import { DepositRedeem } from '@/src/pagePartials/sdai/DepositRedeem'
import { InfoTable } from '@/src/pagePartials/sdai/InfoTable'
import { DepositRedeemTabs } from '@/types/modal'
import { Token } from '@/types/token'

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

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 48px;
    padding-bottom: 40px;
  }
`
// TODO
const apy = ''

const Sdai: NextPage = () => {
  const [token, setToken] = useState<Token | undefined>(useTokenInfo('WXDAI'))
  const [tab, setTab] = useState<DepositRedeemTabs>('deposit')
  const onTokenSelect = (token: Token) => {
    setToken(token)
  }

  return (
    <>
      <Title>sDAI</Title>
      <Paragraph>Deposit your XDAI or WXDAI to SavingsDAI and earn {apy}% APY</Paragraph>
      <MandatoryConnection>
        <BigContainer>
          <InfoTable symbol={token?.symbol} />
          {token && (
            <DepositRedeem
              activeTab={tab}
              onTokenSelect={onTokenSelect}
              setTab={setTab}
              token={token}
            />
          )}
        </BigContainer>
      </MandatoryConnection>
    </>
  )
}

export default Sdai

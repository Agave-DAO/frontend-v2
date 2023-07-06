import React from 'react'
import styled from 'styled-components'

import { Swap } from '@/src/components/assets/Swap'
import {
  Rows as BaseRows,
  EmphasizedRowValue,
  Row,
  RowKey,
  RowValueBig,
} from '@/src/components/common/Rows'
import { Address } from '@/src/components/helpers/Address'
import { GoToExplorer } from '@/src/components/helpers/GoToExplorer'

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 16px;
  padding-left: 16px;
`

const Rows = styled(BaseRows)`
  margin-bottom: 24px;
`

const ValueUp = styled.span`
  color: ${({ theme: { colors } }) => colors.tertiary};
  font-size: 1.4rem;
  font-weight: 400;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

const Note = styled.span`
  color: ${({ theme: { colors } }) => colors.lightGray};
  font-size: 1.4rem;
  font-weight: 400;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

const ExternalLink = styled(Address)`
  .link {
    opacity: 0.4;
  }
`

const OrderId = styled(GoToExplorer)`
  .link {
    opacity: 0.4;
  }
`

export const PositionDetails: React.FC = () => (
  <>
    <Rows>
      <Row variant="dark">
        <RowKey>Tran. Hash</RowKey>
        <RowValueBig>
          <ExternalLink
            address={'0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'}
            showCopyButton={false}
          />
        </RowValueBig>
      </Row>
    </Rows>
    <Title>Sizes</Title>
    <Rows>
      <Row variant="dark">
        <RowKey>Net Value</RowKey>
        <EmphasizedRowValue>
          <ValueUp>+$30.90 (+40.33%)</ValueUp> $107.51
        </EmphasizedRowValue>
      </Row>
      <Row>
        <RowKey>Size</RowKey>
        <EmphasizedRowValue>
          <Note>Orders (1)</Note> $734.77
        </EmphasizedRowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Collateral</RowKey>
        <EmphasizedRowValue>$76.61</EmphasizedRowValue>
      </Row>
    </Rows>
    <Title>Prices</Title>
    <Rows>
      <Row variant="dark">
        <RowKey>Market Price</RowKey>
        <EmphasizedRowValue>$15.84</EmphasizedRowValue>
      </Row>
      <Row>
        <RowKey>Entry Price</RowKey>
        <EmphasizedRowValue>$16.53</EmphasizedRowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Liq. Price</RowKey>
        <EmphasizedRowValue>$18.09</EmphasizedRowValue>
      </Row>
    </Rows>
  </>
)

export const CollateralSwapDetails: React.FC = () => (
  <>
    <Rows>
      <Row variant="dark">
        <RowKey>Order Id</RowKey>
        <RowValueBig>
          <OrderId address={'0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'} text="4c6181a9" />
        </RowValueBig>
      </Row>
      <Row>
        <RowKey>Sub. Time</RowKey>
        <RowValueBig>12 Jun 2022. 11:35PM</RowValueBig>
      </Row>
      <Row variant="dark">
        <RowKey>Exp. Time</RowKey>
        <RowValueBig>12 Jun 2022. 11:35PM</RowValueBig>
      </Row>
    </Rows>
    <Title>Prices</Title>
    <Rows>
      <Row variant="dark">
        <RowKey>Amount</RowKey>
        <EmphasizedRowValue>1,500.84 USDT</EmphasizedRowValue>
      </Row>
      <Row>
        <RowKey>Fee</RowKey>
        <EmphasizedRowValue>0,20% + 0.01 USDC</EmphasizedRowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Price</RowKey>
        <RowValueBig>
          1 USDC = 10.000034 XDAI <Swap />
        </RowValueBig>
      </Row>
    </Rows>
  </>
)

export const ClosedPositionDetails: React.FC = () => (
  <>
    <Rows>
      <Row variant="dark">
        <RowKey>Order Id</RowKey>
        <RowValueBig>
          <OrderId address={'0x8a26b2cC331c9aa871AFD802DB6379a98e0a9b8d'} text="6a66859b" />
        </RowValueBig>
      </Row>
      <Row>
        <RowKey>From</RowKey>
        <RowValueBig>
          <ExternalLink
            address={'0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'}
            showCopyButton={false}
          />
        </RowValueBig>
      </Row>
      <Row variant="dark">
        <RowKey>To</RowKey>
        <RowValueBig>
          <ExternalLink
            address={'0x6379a98e89C581c9aa871AFD802DB0CEdbBAcC33'}
            showCopyButton={false}
          />
        </RowValueBig>
      </Row>
    </Rows>
    <Title>Sizes</Title>
    <Rows>
      <Row variant="dark">
        <RowKey>Net Value</RowKey>
        <EmphasizedRowValue>
          <ValueUp>+$30.90 (+40.33%)</ValueUp> $107.51
        </EmphasizedRowValue>
      </Row>
      <Row>
        <RowKey>Size</RowKey>
        <EmphasizedRowValue>
          <Note>Orders (1)</Note> $734.77
        </EmphasizedRowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Collateral</RowKey>
        <EmphasizedRowValue>$76.61</EmphasizedRowValue>
      </Row>
    </Rows>
    <Title>Prices</Title>
    <Rows>
      <Row variant="dark">
        <RowKey>Market Price</RowKey>
        <EmphasizedRowValue>$15.84</EmphasizedRowValue>
      </Row>
      <Row>
        <RowKey>Entry Price</RowKey>
        <EmphasizedRowValue>$16.53</EmphasizedRowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Liq. Price</RowKey>
        <EmphasizedRowValue>$18.09</EmphasizedRowValue>
      </Row>
    </Rows>
  </>
)

export const ClosedCollateralSwapDetails: React.FC = () => (
  <>
    <Rows>
      <Row variant="dark">
        <RowKey>Tran. Hash</RowKey>
        <RowValueBig>
          <ExternalLink
            address={'0x71AFD802DB69C58BAcC331c9aa8379a98e80CEdb'}
            showCopyButton={false}
          />
        </RowValueBig>
      </Row>
      <Row>
        <RowKey>From</RowKey>
        <RowValueBig>
          <ExternalLink
            address={'0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb'}
            showCopyButton={false}
          />
        </RowValueBig>
      </Row>
      <Row variant="dark">
        <RowKey>To</RowKey>
        <RowValueBig>
          <ExternalLink
            address={'0x6379a98e89C581c9aa871AFD802DB0CEdbBAcC33'}
            showCopyButton={false}
          />
        </RowValueBig>
      </Row>
      <Row>
        <RowKey>Sub. Time</RowKey>
        <RowValueBig>12 Jun 2022. 11:35PM</RowValueBig>
      </Row>
      <Row variant="dark">
        <RowKey>Exp. Time</RowKey>
        <RowValueBig>12 Jun 2022. 11:35PM</RowValueBig>
      </Row>
    </Rows>
    <Title>Prices</Title>
    <Rows>
      <Row variant="dark">
        <RowKey>Amount</RowKey>
        <EmphasizedRowValue>1,500.84 USDT</EmphasizedRowValue>
      </Row>
      <Row>
        <RowKey>Fee</RowKey>
        <EmphasizedRowValue>0,20% + 0.01 USDC</EmphasizedRowValue>
      </Row>
      <Row variant="dark">
        <RowKey>Price</RowKey>
        <RowValueBig>
          1 USDC = 10.000034 XDAI <Swap />
        </RowValueBig>
      </Row>
    </Rows>
  </>
)

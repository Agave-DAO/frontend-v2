import styled from 'styled-components'

import { RowVariant } from '@/src/components/common/Rows'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 320px;
  width: auto;
`

const Text = styled.p`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 12px;

  &:last-child {
    margin-bottom: 0;
  }
`

Text.defaultProps = {
  className: 'text',
}

const TextSmall = styled(Text)`
  font-size: 1.2rem;
`

const Card = styled.div``

Card.defaultProps = {
  className: 'card',
}

const Rows = styled.div``

Rows.defaultProps = {
  className: 'rows',
}

const Row = styled.div<{ variant?: RowVariant }>``

Row.defaultProps = {
  className: 'row',
}

const RowKey = styled.div``

RowKey.defaultProps = {
  className: 'rowKey',
}

const RowValue = styled.div``

RowValue.defaultProps = {
  className: 'rowValue',
}

export const ApproximateBalance = (
  <Wrapper>
    <Text>
      Your <b>aggregated balance</b> shows the approximate value in USD of all the assets you have
      deposited. It fluctuates based on the evolution of prices.
    </Text>
    <Text>
      Please note that if your deposits consist of stable-coins the approximate balance in USD could
      be slightly higher or lower than the stable-coin balance, due to fluctuations in the
      stable-coin peg.
    </Text>
  </Wrapper>
)

export const Rewards = (
  <Wrapper>
    <Text>
      Rewards in Balancer Pool tokens.
      <br />
      Click{' '}
      <a
        href="https://app.balancer.fi/#/gnosis-chain/pool/0x388cae2f7d3704c937313d990298ba67d70a3709000200000000000000000026"
        rel="noreferrer"
        target="_blank"
      >
        here
      </a>{' '}
      for more info.
    </Text>
  </Wrapper>
)

export const HealthFactor = (
  <Wrapper>
    <Text>
      The <b>health factor</b> is the numeric representation of the safety of your deposited assets
      against the borrowed assets and its underlying value. The higher the value is, the safer the
      state of your funds are against a liquidation scenario.
    </Text>
    <Text>
      If the <b>health factor</b> reaches 1, the liquidation of your deposits will be triggered, and
      a <b>health factor</b> below 1 can get liquidated.
    </Text>
    <Text>
      For a <b>health factor</b> of 2, the collateral value vs borrow can reduce up to 50%.
    </Text>
  </Wrapper>
)

export const MaximumLTV = (
  <Wrapper>
    <Text>
      The <b>Maximum Loan-to-Value (LTV) ratio</b> represents the maximum borrowing power of a
      specific collateral.
    </Text>
    <Text>
      For example, if a collateral has a <b>LTV</b> of 75%, the user can borrow up to 0.75 worth of
      ETH in the principal currency for every 1 ETH worth of collateral.
    </Text>
  </Wrapper>
)

export const LiquidityThreshold = (
  <Wrapper>
    <Text>
      This represents the threshold at which a borrow position will be considered
      undercollateralized and subject to liquidation for each collateral.
    </Text>
    <Text>
      For example, if a collateral has a <b>liquidation threshold</b> of 80%, it means that the loan
      will be liquidated when the debt value is worth 80% of the collateral value.
    </Text>
  </Wrapper>
)

export const LiquidityPenalty = (
  <Wrapper>
    <Text>
      When a liquidation occurs, liquidators repay part or all of the outstanding borrowed amount on
      behalf of the borrower.
    </Text>
    <Text>
      In return, they can buy the collateral at a discount and keep the difference as a bonus!
    </Text>
  </Wrapper>
)

export const CurrentLTV: React.FC<{
  currentLTV: React.ReactNode
  maxLTV: React.ReactNode
  liquidationThreshold: React.ReactNode
}> = ({ currentLTV, liquidationThreshold, maxLTV }) => {
  return (
    <Wrapper>
      <Text>
        <b>Liquidation Overview</b>
      </Text>
      <Text>
        Details about your <b>Loan to Value</b> (LTV) ratio and liquidation.
      </Text>
      <TextSmall>
        <i>* Adjusted to the type of collateral deposited.</i>
      </TextSmall>
      <Rows>
        <Row variant="dark">
          <RowKey>Current LTV</RowKey>
          <RowValue>{currentLTV}</RowValue>
        </Row>
        <Row variant="light">
          <RowKey>Maximum LTV</RowKey>
          <RowValue>{maxLTV}</RowValue>
        </Row>
        <Row>
          <RowKey>Liquidation threshold</RowKey>
          <RowValue>{liquidationThreshold}</RowValue>
        </Row>
      </Rows>
    </Wrapper>
  )
}

export const CooldownPeriod = (
  <Wrapper>
    <Text>
      You can only withdraw your assets from the Security Module after the <b>cooldown period</b>{' '}
      ends and the unstake window is active.
    </Text>
    <Text>
      The <b>cooldown period</b> can be activated by pressing the 'Activate Cooldown' button.
    </Text>
  </Wrapper>
)

export const UnstakeWindow = (
  <Wrapper>
    <Text>
      Once the cooldown period expires, you're free to withdraw within the time frame of the{' '}
      <b>unstake window</b>.
    </Text>
    <Text>
      If you fail to withdraw your assets during the <b>unstake window</b>, you need to activate the
      cooldown period again and wait for the next unstake window.
    </Text>
  </Wrapper>
)

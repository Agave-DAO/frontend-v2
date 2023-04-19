import { useState } from 'react'
import styled from 'styled-components'

import { ActionButton } from '@/src/components/buttons/ActionButton'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'

const Wrapper = styled.div`
  display: grid;
  row-gap: 16ßßpx;
`

const Empty = styled(EmptyContent)`
  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    align-items: center;
    text-align: center;
  }
`

const DesktopBreakpoint = styled.br`
  display: none;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    display: block;
  }
`

const Buttons = styled.div`
  display: grid;
  row-gap: 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    column-gap: 24px;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    margin: 48px auto 0;
    max-width: fit-content;
  }
`

export const VaultsList: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const [vaults, setVaults] = useState<Array<number>>([])

    return vaults.length ? (
      <Wrapper {...restProps}>
        {vaults.map((vault, index) => (
          <div key={index}>item {vault}</div>
        ))}
      </Wrapper>
    ) : (
      <Empty
        text={
          <>
            A vault can receive cryptocurrency like a normal asset balance in your account.{' '}
            <DesktopBreakpoint />
            Deposit collateral and borrow your future yield.
            <br />
            <br />
            <Buttons>
              <ActionButton onClick={() => console.log('clicked')} variant="darker">
                Learn more
              </ActionButton>
              <ActionButton onClick={() => setVaults([...vaults, 0, 1, 2, 3, 4])}>
                Create vault
              </ActionButton>
            </Buttons>
          </>
        }
        title="No vaults created yet"
      />
    )
  },
  ({ ...restProps }) => <div {...restProps}>VaultsList skeleton</div>,
)

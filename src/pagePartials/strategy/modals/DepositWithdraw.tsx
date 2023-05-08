import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  Rows as BaseRows,
  Button,
  ButtonWrapper,
  FormCard,
  Row,
  RowKey,
  RowValue,
} from '@/src/components/card/FormCard'
import { TitleWithAction } from '@/src/components/common/TitleWithAction'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { VaultInfo } from '@/src/pagePartials/strategy/vaults/VaultInfo'
import { DepositWithdrawTabs } from '@/types/modal'

const Tabs = styled(BaseTabs)`
  margin: 32px auto;
`

const Info = styled(EmptyContent)`
  margin-bottom: 32px;
  width: 100%;

  .alert {
    display: none;
  }
`

const Rows = styled(BaseRows)`
  margin-bottom: 16px;
`

interface Props extends ModalProps {
  activeTab?: DepositWithdrawTabs
}

export const DepositWithdraw: React.FC<Props> = withGenericSuspense(
  ({ activeTab, onClose, ...restProps }) => {
    const [tab, setTab] = useState<DepositWithdrawTabs>('deposit')
    const depositActive = tab === 'deposit'
    const withdrawActive = tab === 'withdraw'

    useEffect(() => {
      if (activeTab) {
        setTab(activeTab)
      }
    }, [activeTab])

    const withdraw = useCallback(() => {
      console.log('withdraw')
      onClose()
    }, [onClose])

    const deposit = useCallback(() => {
      console.log('deposit')
      onClose()
    }, [onClose])

    return (
      <Modal onClose={onClose} {...restProps}>
        <RequiredConnection>
          <Info text={<VaultInfo />} title="Vault information" />
          <Tabs>
            <Tab isActive={depositActive} onClick={() => setTab('deposit')}>
              Deposit
            </Tab>
            <Tab isActive={withdrawActive} onClick={() => setTab('withdraw')}>
              Withdraw
            </Tab>
          </Tabs>
          <FormCard>
            <TitleWithAction
              button={{
                onClick: () => console.log('click'),
                text: 'Use max',
              }}
              title={`Amount to ${depositActive ? 'deposit' : 'withdraw'}`}
            />
            <Rows>
              <Row>
                <RowKey>Available</RowKey>
                <RowValue>
                  <TokenIcon dimensions={18} symbol={'usdc'} />
                  1,000,000.00
                </RowValue>
              </Row>
            </Rows>
            <ButtonWrapper>
              {depositActive ? (
                <Button onClick={deposit}>Deposit</Button>
              ) : (
                <Button onClick={withdraw}>Withdraw</Button>
              )}
            </ButtonWrapper>
          </FormCard>
        </RequiredConnection>
      </Modal>
    )
  },
  () => <>Loading...</>,
)

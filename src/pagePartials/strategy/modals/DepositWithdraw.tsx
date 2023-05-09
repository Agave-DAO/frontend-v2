import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

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
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInputDropdown } from '@/src/components/token/TokenInputDropdown'
import { VaultInfo } from '@/src/pagePartials/strategy/vaults/VaultInfo'
import { DepositWithdrawTabs } from '@/types/modal'
import { Token } from '@/types/token'

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

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

interface Props extends ModalProps {
  activeTab?: DepositWithdrawTabs
}

export const DepositWithdraw: React.FC<Props> = withGenericSuspense(
  ({ activeTab, onClose, ...restProps }) => {
    const [tab, setTab] = useState<DepositWithdrawTabs>('deposit')
    const depositActive = tab === 'deposit'
    const withdrawActive = tab === 'withdraw'
    const [value, setValue] = useState('0')
    const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
    const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()
    const [token, setToken] = useState<Token | null>({
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      decimals: 6,
      chainId: 100,
      logoURI: '/coins/usdc.svg',
      extensions: {
        isNative: false,
        isNativeWrapper: false,
      },
      type: 'reserve',
    })
    const tokenSymbol = 'usdc'

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

    const onDropdownChange = (token: Token | null) => {
      setToken(token)
      console.log('token', token)
    }

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
                  <TokenIcon dimensions={18} symbol={tokenSymbol} />
                  1,000,000.00
                </RowValue>
              </Row>
            </Rows>
            <TokenInputDropdown
              decimals={18}
              maxValue={'10000'}
              onDropdownChange={onDropdownChange}
              selectedToken={token}
              setStatus={() => console.log('setStatus')}
              setStatusText={() => console.log('setStatusText')}
              setValue={setValue}
              status={tokenInputStatus}
              statusText={tokenInputStatusText}
              usdPrice={BigNumber.from('1000000000000000000')}
              value={value}
            />
            <Buttons>
              {depositActive ? (
                <Button onClick={deposit}>Deposit</Button>
              ) : (
                <Button onClick={withdraw}>Withdraw</Button>
              )}
            </Buttons>
          </FormCard>
        </RequiredConnection>
      </Modal>
    )
  },
  () => <>Loading...</>,
)

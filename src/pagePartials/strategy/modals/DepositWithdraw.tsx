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
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
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
  margin-bottom: 8px;
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

    useEffect(() => {
      if (activeTab) {
        setTab(activeTab)
      }
    }, [activeTab])

    const withdraw = useCallback(() => {
      onClose()
    }, [onClose])

    const deposit = useCallback(() => {
      onClose()
    }, [onClose])

    const onDropdownChange = (token: Token | null) => {
      setToken(token)
    }

    return (
      <Modal onClose={onClose} {...restProps}>
        <Info text={<VaultInfo vaultAddress={''} />} title="Vault information" />
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
                {token && <TokenIcon dimensions={18} symbol={token?.symbol} />}
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
      </Modal>
    )
  },
  ({ onClose, ...restProps }) => (
    <Modal onClose={onClose} {...restProps}>
      <SkeletonLoading
        style={{
          alignItems: 'center',
          borderRadius: '16px',
          columnGap: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '175px',
          justifyContent: 'space-between',
          padding: '16px',
        }}
      >
        {Array.from({ length: 3 }).map((item, index) => (
          <SkeletonLoading animate={false} key={index} style={{ height: '35px' }} />
        ))}
      </SkeletonLoading>
      <Tabs style={{ margin: '32px auto', height: '89px', maxWidth: 'none', width: '244px' }} />
      <SkeletonLoading
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: '16px',
          columnGap: '16px',
          height: '277px',
          padding: '16px',
        }}
      >
        {Array.from({ length: 5 }).map((item, index) => (
          <SkeletonLoading animate={false} key={index} style={{ height: '35px' }} />
        ))}
      </SkeletonLoading>
    </Modal>
  ),
)

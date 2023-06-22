import { useCallback, useMemo, useState } from 'react'
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
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Modal, Props as ModalProps } from '@/src/components/modals/Modal'
import { Tabs as BaseTabs, Tab } from '@/src/components/tabs/Tabs'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInputDropdown } from '@/src/components/token/TokenInputDropdown'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { contracts } from '@/src/contracts/contracts'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useGetUserVaultBalances } from '@/src/hooks/queries/useGetUserVaultBalances'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useMarketVersion } from '@/src/hooks/useMarketVersion'
import useTransaction from '@/src/hooks/useTransaction'
import { VaultInfo } from '@/src/pagePartials/strategy/vaults/VaultInfo'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { NumberType } from '@/src/utils/format'
import { ERC20__factory } from '@/types/generated/typechain'
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

const Title = styled(BaseTitle)`
  font-size: 2.4rem;
  margin: 0 0 32px;
`

const Rows = styled(BaseRows)`
  margin-bottom: 8px;
`

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

interface Props extends ModalProps {
  activeTab?: DepositWithdrawTabs
  vaultAddress?: string
}

export const DepositWithdraw: React.FC<Props> = withGenericSuspense(
  ({ activeTab, onClose, ...restProps }) => {
    const { web3Provider } = useWeb3ConnectedApp()
    const [marketVersion] = useMarketVersion()
    const { openDepositWithdrawModal, vaultAddress, vaultName } = useVaultModalContext()
    const { refetchUserVaultBalance, vaultBalances } = useGetUserVaultBalances(vaultAddress)
    const { mutate: refetchUserReserveData } = useGetUserReservesData()

    const [value, setValue] = useState('0')
    const [loading, setLoading] = useState(false)

    const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
    const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

    const vualtProxy = contracts[marketVersion].SwapperUserProxyImplementation.factory.connect(
      vaultAddress,
      web3Provider.getSigner(),
    )

    const sendTx = useTransaction()

    const agaveTokens = useAgaveTokens().reserveTokens

    // default token is the first token in the list of reserve tokens
    const [token, setToken] = useState<Token>(agaveTokens[0])

    // get the data for the selected reserve token
    const { priceData } = useMarketsData().getMarket(token.address)

    // get the agToken for the selected reserve token
    const agToken = token?.extensions.protocolTokens?.ag

    // if the agToken is not defined, throw an error
    if (!agToken) {
      throw new Error('agToken is not defined')
    }

    // create a contract instance for the agToken (ERC20)
    const agTokenInstance = useContractInstance(ERC20__factory, agToken, { useSigner: true })

    // get user deposits for the selected reserve token
    const selectedTokenDeposit = useUserDeposits().find(
      ({ assetAddress }) => assetAddress === token.address,
    )

    // get the balance of agTokens in the vault to withdraw from the vault
    const selectedTokenBalanceInVault = vaultBalances?.find(
      (vaultBalance) => vaultBalance.token.address === token.address,
    )

    const activeTokenBalance = useMemo(() => {
      if (activeTab === 'deposit') {
        // return deposit amount for the selected reserve token (agToken balance) to deposit into the vault
        return selectedTokenDeposit?.depositedAmount || ZERO_BN
      } else {
        // return balance in the vault to withdraw from the vault
        return selectedTokenBalanceInVault?.balanceRaw || ZERO_BN
      }
    }, [activeTab, selectedTokenBalanceInVault?.balanceRaw, selectedTokenDeposit?.depositedAmount])
    const onTransactionSuccess = useCallback(() => {
      setLoading(false)
      setValue('')
      onClose()
      refetchUserVaultBalance()
      refetchUserReserveData()
    }, [onClose, refetchUserReserveData, refetchUserVaultBalance])

    const withdraw = useCallback(async () => {
      setLoading(true)
      try {
        const tx = await sendTx(() => vualtProxy['withdraw(address,uint256)'](agToken, value))
        if (tx) {
          onTransactionSuccess()
        } else {
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
      }
    }, [agToken, onTransactionSuccess, sendTx, value, vualtProxy])

    const deposit = useCallback(async () => {
      try {
        const tx = await sendTx(() => agTokenInstance.transfer(vaultAddress, value))
        if (tx) {
          onTransactionSuccess()
        } else {
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
      }
    }, [agTokenInstance, onTransactionSuccess, sendTx, value, vaultAddress])

    const disableSubmit = useMemo(() => {
      return !value || !Number(value) || tokenInputStatus === TextfieldStatus.error || loading
    }, [loading, tokenInputStatus, value])

    return (
      <Modal onClose={onClose} {...restProps}>
        {activeTab === 'deposit' ? (
          <Title>
            Deposit in <em>{vaultName}</em> vault
          </Title>
        ) : (
          <Title>
            Withdraw from <em>{vaultName}</em> vault
          </Title>
        )}
        <Info text={<VaultInfo />} title="" />
        <Tabs>
          <Tab
            isActive={activeTab === 'deposit'}
            onClick={() => openDepositWithdrawModal('deposit')}
          >
            Deposit
          </Tab>
          <Tab
            isActive={activeTab === 'withdraw'}
            onClick={() => openDepositWithdrawModal('withdraw')}
          >
            Withdraw
          </Tab>
        </Tabs>
        <FormCard>
          <TitleWithAction
            button={{
              onClick: () => setValue(activeTokenBalance.toString()),
              text: 'Use max',
            }}
            title={`Amount to ${activeTab === 'deposit' ? 'deposit' : 'withdraw'}`}
          />
          <Rows>
            <Row>
              <RowKey>Available</RowKey>
              <RowValue>
                {token && <TokenIcon dimensions={18} symbol={token?.symbol} />}
                <Amount
                  decimals={token.decimals}
                  numberType={NumberType.SwapTradeAmount}
                  symbol=""
                  value={activeTokenBalance}
                />
              </RowValue>
            </Row>
          </Rows>
          <TokenInputDropdown
            decimals={token.decimals}
            maxValue={activeTokenBalance.toString()}
            onDropdownChange={(token) => (token ? setToken(token) : null)}
            selectedToken={token}
            setStatus={setTokenInputStatus}
            setStatusText={setTokenInputStatusText}
            setValue={setValue}
            status={tokenInputStatus}
            statusText={tokenInputStatusText}
            usdPrice={priceData}
            value={value}
          />
          <Buttons>
            {activeTab === 'deposit' ? (
              <Button disabled={disableSubmit} onClick={deposit}>
                Deposit
              </Button>
            ) : (
              <Button disabled={disableSubmit} onClick={withdraw}>
                Withdraw
              </Button>
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

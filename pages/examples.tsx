/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ReactElement, useState } from 'react'
import styled from 'styled-components'

import type { NextPageWithLayout } from '@/pages/_app'
import { ButtonPrimary } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Modal, ModalText } from '@/src/components/common/Modal'
import { Address } from '@/src/components/helpers/Address'
import { SidebarLayout } from '@/src/components/layout/SidebarLayout'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TwoColumnsGrid } from '@/src/components/layout/TwoColumnsGrid'
import { InlineLoading } from '@/src/components/loading/InlineLoading'
import { Loading } from '@/src/components/loading/Loading'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenDropdown } from '@/src/components/token/TokenDropdown'
import { TokenModal } from '@/src/components/token/TokenModal'
import TokenSpend from '@/src/components/token/TokenSpend'
import { contracts } from '@/src/contracts/contracts'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import SendUSDCForm from '@/src/pagePartials/examples/SendUSDCForm'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ERC20__factory } from '@/types/generated/typechain'
import { Token } from '@/types/token'

const Card = styled(BaseCard)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`

const TokenIconsContextProvider = dynamic(() => import('@/src/providers/tokenIconsProvider'), {
  ssr: false,
})

const LeftSidebarLayout: NextPageWithLayout = () => {
  const { address, appChainId } = useWeb3Connection()
  const [showModal, setShowModal] = useState(false)
  const [tokenDropdown, setTokenDropdown] = useState<Token | null>(null)
  const [tokenModal, setTokenModal] = useState<Token | null>(null)

  const usdcAddress = contracts['USDC'].address[appChainId]

  return (
    <>
      <BaseTitle>Alternative Layout</BaseTitle>
      <Card>
        <BaseParagraph>
          There should be a sidebar / menu on the left now (or at the bottom if you're looking at
          this on a mobile device). Change everything you want there.
        </BaseParagraph>
        <BaseParagraph>
          Going to{' '}
          <Link href="/right-sidebar-layout" passHref>
            Alternative Layout 2
          </Link>{' '}
          should only change the page's contents, but the sidebar / menu should remain unaltered.
        </BaseParagraph>
      </Card>
      <BaseTitle>Components</BaseTitle>
      <Card>
        <TokenIconsContextProvider>
          <TwoColumnsGrid alignItems="start">
            <div>
              <BaseParagraph>Token Dropdown:</BaseParagraph>
              <SimpleGrid>
                <TokenDropdown onChange={setTokenDropdown} />
                {tokenDropdown?.address && <Address address={tokenDropdown?.address} />}
              </SimpleGrid>
            </div>
            <div>
              <BaseParagraph>Token Modal:</BaseParagraph>
              <SimpleGrid>
                <TokenModal onChange={setTokenModal} />
                {tokenModal?.address && <Address address={tokenModal?.address} />}
              </SimpleGrid>
            </div>
          </TwoColumnsGrid>
        </TokenIconsContextProvider>
        <hr />
        <BaseParagraph>Token Input:</BaseParagraph>
        <RequiredConnection>
          <SendUSDCForm />
        </RequiredConnection>
        <hr />
        <BaseParagraph>Spend token (Deposit, Withdraw, Borrow, etc)</BaseParagraph>
        <RequiredConnection>
          <TokenSpend
            erc20Address={usdcAddress}
            label="Deposit"
            spendAction={(): any =>
              alert(`
              contract call that does something with the approval, 
              like a deposit, borrow, withdraw or just a transferFrom
              
              erc20.transferFrom(
                address, 
                '0xFdAf1D88B800308Ead39F34D5eB24eB219d68ad9', 
                '1000000'
              )
            `)
            }
            spender="0xFdAf1D88B800308Ead39F34D5eB24eB219d68ad9"
          />
        </RequiredConnection>

        <hr />
        <BaseParagraph>Modal:</BaseParagraph>
        <SimpleGrid>
          <ButtonPrimary onClick={() => setShowModal(true)}>Click to see a modal</ButtonPrimary>
          {showModal && (
            <Modal onClose={() => setShowModal(false)} title="I'm a beautiful modal!">
              <ModalText>
                <img
                  alt="Dance!"
                  src="https://media.giphy.com/media/S78kszeHfIrjTc44Hf/giphy.gif"
                />
              </ModalText>
              <ModalText>You should be dancing and you know it!</ModalText>
            </Modal>
          )}
        </SimpleGrid>
        <hr />
        <TwoColumnsGrid alignItems="start">
          <div>
            <BaseParagraph>Loading / spinner:</BaseParagraph>
            <SimpleGrid>
              <Loading style={{ margin: 0 }} text="Loading stuff..." />
            </SimpleGrid>
          </div>
          <div>
            <BaseParagraph>Inline loading:</BaseParagraph>
            <SimpleGrid>
              <InlineLoading text="Inline-ly loading more stuff..." />
            </SimpleGrid>
          </div>
        </TwoColumnsGrid>
      </Card>
    </>
  )
}

LeftSidebarLayout.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>
}

export default LeftSidebarLayout

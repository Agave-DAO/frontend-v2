import { useState } from 'react'
import styled from 'styled-components'

import { DebounceInput } from 'react-debounce-input'

import { ButtonDropdown as Button } from '@/src/components/buttons/Button'
import { Modal as BaseModal } from '@/src/components/common/Modal'
import { TextfieldCSS } from '@/src/components/form/Textfield'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useTokensLists } from '@/src/hooks/useTokensLists'
import { Token } from '@/types/token'

const Modal = styled(BaseModal)`
  .modalCard {
    height: 500px;
    max-height: 100vh;
  }
`

const TextfieldContainer = styled.div`
  background-color: ${({ theme }) => theme.dropdown.background};
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  margin-bottom: 15px;
  margin-left: -${({ theme: { card } }) => card.paddingHorizontal};
  margin-right: -${({ theme: { card } }) => card.paddingHorizontal};
  padding-bottom: 15px;
  padding-left: ${({ theme: { card } }) => card.paddingHorizontal};
  padding-right: ${({ theme: { card } }) => card.paddingHorizontal};
  width: calc(100% + ${({ theme: { card } }) => card.paddingHorizontal} * 2);
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Textfield: any = styled(DebounceInput)`
  ${TextfieldCSS};

  flex-shrink: 0;
  width: 100%;
`

const List = styled.div`
  border-radius: ${({ theme: { common } }) => common.borderRadius};
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  display: flex;
  flex-direction: column;
  height: 360px;
  overflow: auto;
  width: 100%;
`

const NoResults = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.3rem;
  font-weight: 500;
  justify-content: center;
  line-height: 1.2;
  margin: auto;
`

const Item = styled.button`
  align-items: center;
  background-color: transparent;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  border-left: none;
  border-right: none;
  border-top: none;
  column-gap: 10px;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  font-size: 1.4rem;
  height: 38px;
  justify-content: flex-start;
  padding: 0 14px;
  transition: background-color 0.15s linear;
  width: 100%;

  &:hover {
    background-color: ${({ theme: { colors } }) => colors.darkGrayDarkened};
  }

  &:last-child {
    border-bottom: none;
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const TokenModal: React.FC<{ onChange?: (token: Token | null) => void }> = ({
  onChange,
  ...restProps
}) => {
  const { onSelectToken, searchString, setSearchString, token, tokensList } =
    useTokensLists(onChange)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        {token && <TokenIcon symbol={token.symbol} />}
        {token ? token.symbol : 'Select a token...'}
      </Button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Select a token" {...restProps}>
          <TextfieldContainer key="tokenSearchInput">
            <Textfield
              debounceTimeout={300}
              onChange={(e: { target: { value: string } }) => setSearchString(e.target.value)}
              placeholder="Search token..."
              type="search"
              value={searchString}
            />
          </TextfieldContainer>
          <List>
            {tokensList.length === 0 ? (
              <NoResults>Not found.</NoResults>
            ) : (
              tokensList.map((item, index) => (
                <Item
                  key={index}
                  onClick={() => {
                    onSelectToken(item)
                    setShowModal(false)
                  }}
                >
                  <TokenIcon symbol={item.symbol} />
                  {item.symbol}
                </Item>
              ))
            )}
          </List>
        </Modal>
      )}
    </>
  )
}

export default TokenModal

import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 0 32px;
  padding: 0 8px 0 16px;
`

const Buttons = styled.div`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.lighterGray};
  border-radius: 60px;
  display: flex;
  height: 34px;
  padding: 4px;
`

const Button = styled.button<{ isActive: boolean }>`
  align-items: center;
  border-radius: 20px;
  border: none;
  background-color: ${({ isActive }) => (isActive ? '#fff' : 'transparent')};
  color: ${({ theme: { colors } }) => colors.darkishGray};
  cursor: pointer;
  display: flex;
  font-size: 1.3rem;
  font-weight: 400;
  height: 100%;
  line-height: 1.2;
  padding: 0 8px;
`

const Text = styled.span`
  color: ${({ theme: { colors } }) => colors.darkishGray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

export const ToggleWrap: React.FC<{
  isWrapped?: boolean
  onChange?: (isWrapped: boolean) => void
}> = ({ isWrapped, onChange, ...restProps }) => {
  const [wrapped, setWrapped] = useState<boolean>(isWrapped ?? false)

  useEffect(() => {
    if (onChange) {
      onChange(wrapped)
    }
  }, [onChange, wrapped])

  return (
    <Wrapper {...restProps}>
      <Buttons>
        <Button isActive={!wrapped} onClick={() => setWrapped(false)}>
          XDAI
        </Button>
        <Button isActive={wrapped} onClick={() => setWrapped(true)}>
          WXDAI
        </Button>
      </Buttons>
      <Text>{wrapped ? 'Wrapped' : 'Unwrapped'} token</Text>
    </Wrapper>
  )
}

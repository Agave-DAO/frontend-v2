import { HTMLAttributes, useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonMini } from '@/src/components/buttons/ButtonMini'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { useTokenInfo } from '@/src/hooks/useTokenInfo'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Container = styled.div`
  position: relative;
  display: flex;
  background-color: #0d202620;
  border-radius: 15px;
`

const SVGButton = styled(ButtonMini)`
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  padding: 0;
  position: relative;
  border-radius: 15px;
  background-color: ${({ theme: { buttonMini } }) => buttonMini.dark.backgroundColor};
`
const TextButton = styled.button`
  height: 30px;
  padding: 0 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  cursor: pointer;
  background-color: transparent;
  color: #ffffff;
`

interface AddToWalletProps extends HTMLAttributes<SVGElement> {
  symbol: string
  text?: string
}

export const WalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg
      fill="#ffffff"
      height="14"
      viewBox="0 0 458.531 458.531"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M336.688,343.962L336.688,343.962c-21.972-0.001-39.848-17.876-39.848-39.848v-66.176
				c0-21.972,17.876-39.847,39.848-39.847h103.83c0.629,0,1.254,0.019,1.876,0.047v-65.922c0-16.969-13.756-30.725-30.725-30.725
				H30.726C13.756,101.49,0,115.246,0,132.215v277.621c0,16.969,13.756,30.726,30.726,30.726h380.943
				c16.969,0,30.725-13.756,30.725-30.726v-65.922c-0.622,0.029-1.247,0.048-1.876,0.048H336.688z"
      />
      <path
        d="M440.518,219.925h-103.83c-9.948,0-18.013,8.065-18.013,18.013v66.176c0,9.948,8.065,18.013,18.013,18.013h103.83
				c9.948,0,18.013-8.064,18.013-18.013v-66.176C458.531,227.989,450.466,219.925,440.518,219.925z M372.466,297.024
				c-14.359,0-25.999-11.64-25.999-25.999s11.64-25.999,25.999-25.999c14.359,0,25.999,11.64,25.999,25.999
				C398.465,285.384,386.825,297.024,372.466,297.024z"
      />
      <path d="M358.169,45.209c-6.874-20.806-29.313-32.1-50.118-25.226L151.958,71.552h214.914L358.169,45.209z" />
    </svg>
  )
}

export const AddToWallet: React.FC<AddToWalletProps> = ({ className, symbol, text }) => {
  const token = useTokenInfo(symbol)
  const { wallet } = useWeb3Connection()
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    setIsAvailable(
      wallet &&
        window.ethereum &&
        window.ethereum.request &&
        typeof window.ethereum.request === 'function',
    )
  }, [wallet])

  const shortSymbol =
    symbol.length > 11
      ? symbol.replace('variableDebt', 'varDebt').replace('stableDebt', 'stDebt')
      : symbol

  const addToWallet = async () => {
    if (isAvailable) {
      if (token) {
        try {
          await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20',
              options: {
                address: token.address,
                symbol: shortSymbol,
                decimals: token.decimals,
              },
            },
          })
        } catch (error) {
          console.error('Error adding token:', error)
        }
      }
    } else {
      console.error('You are not connected with a valid wallet')
    }
  }

  if (!isAvailable) return null

  return (
    <Container>
      <Tooltip content={`Add ${shortSymbol} to wallet`}>
        <Container>
          <SVGButton className={className} onClick={addToWallet}>
            <WalletIcon />
          </SVGButton>
          {text ? <TextButton onClick={addToWallet}>{text}</TextButton> : ''}
        </Container>
      </Tooltip>
    </Container>
  )
}

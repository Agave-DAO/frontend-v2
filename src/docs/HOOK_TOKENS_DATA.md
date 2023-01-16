# useAgaveTokensData

This document provides an overview of a react hook that can be used to get Agave tokens information from an array of tokens. The hook accepts an array of tokens and returns data for each token, such as `priceData`, `reserveData`, `assetData`, and `incentiveData`. Additionally, the hook provides a number of functions that can be used to get data about a single token, such as `getTokenMarketSize`, `getTotalMarketSize`, `getTokenTotalBorrowed`, `getDepositAPY`, `getBorrowRate`, and `getIncentiveRate`.

## How to Use

The hook can be used by importing it into your component, as follows:

```jsx
import { useAgaveTokensData } from '@/src/hooks/agave/useAgaveTokensData'
```

Once the hook is imported, it can be used inside of a functional component as follows:

```jsx
const Component = () => {
  const { agaveTokensData } = useAgaveTokensData(tokensArray)

  // The rest of your component code goes here
}
```

The hook accepts two arguments, an array of `tokenInfo` and an optional boolean to show (or not) frozen tokens.

For example, if we wanted to get token protocol information for the tokens with addresses `0x1`, `0x2`, and `0x3`, we could call the hook like this:

```jsx
const tokenArray = [
  { address: '0x1', decimals: 18, symbol: '', ... },
  { address: '0x2', decimals: 18, symbol: '', ... },
  { address: '0x3', decimals: 18, symbol: '', ... }
]

const { agaveTokensData } = useAgaveTokensData(tokenArray)
```

The hook will return data for each token in the array. The data consists of `tokenAddress`, `priceData`, `reserveData`, `assetData`, and `incentiveData` with the following structure.

```jsx
{
  "0x1": {
    tokenAddress: string
    priceData: BigNumber
    reserveData: getReserveData() ProtocolDataProvider contract method output
    assetData: getAssetData() ProtocolDataProvider contract method ouput
    incentiveData: {
      agToken: [BigNumber, BigNumber, BigNumber]
      variableDebtToken: [BigNumber, BigNumber, BigNumber]
    }
  },
  "0x2": {
      tokenAddress: string
      priceData: BigNumber
      reserveData: getReserveData() ProtocolDataProvider contract method output
      assetData: getAssetData() ProtocolDataProvider contract method ouput
      incentiveData: {
        agToken: [BigNumber, BigNumber, BigNumber]
        variableDebtToken: [BigNumber, BigNumber, BigNumber]
      }
    }
  },
  ...
```

The hook also provides a number of functions that can be used to get data about a single token. These functions are:

```jsx
getTotalMarketSize() // returns the total market size of all tokens in the array
getTokenMarketSize(tokenAddress) // returns the market size of the specified token
getTokenTotalBorrowed(tokenAddress) // returns the total amount of tokens borrowed
getDepositAPY(tokenAddress) // returns the annual percentage yield of a deposit
getBorrowRate(tokenAddress) // returns the rate at which a token is borrowed
getIncentiveRate(tokenAddress, (deposit = true | false)) // returns the rate at which incentives are paid out. Depends on the boolean param, the function return the incentive rate for the deposit token (deposit = true), or variableDebtToken (deposit = false)
```

## How to use the hook to get information for a specific token

Let’s look at an example of how to use the hook to get information for a specific token.

```jsx
const Component = () => {
  const {
    agaveTokensData,
    getBorrowRate,
    getDepositAPY,
    getIncentiveRate,
    getTokenMarketSize,
    getTokenTotalBorrowed,
    getTotalMarketSize,
  } = useAgaveTokensData(tokens, false)

  const marketSize = getTokenMarketSize(tokenAddress) // tokenAddress must be in the tokens array
  const borrowRate = getBorrowRate(tokenAddress)
  const depositAPY = getDepositAPY(tokenAddress)
  const agIncentiveRate = getIncentiveRate(tokenAddress, true)
  const variableDebtIncentiveRate = getIncentiveRate(tokenAddress, false)
  const tokenTotalBorrowed = getTokenTotalBorrowed(tokenAddress)
}
```

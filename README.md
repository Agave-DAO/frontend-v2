# BootNode - Frontend Starter Kit

[Bootnode](https://bootnode.dev) is a web3 development company, with broad experience in the development of web3 products for many of the main players in the industry, such as [these](https://www.bootnode.dev/#projects) and [these](https://www.bootnode.dev/#team).

Starting a new project implies new and exciting challenges that are inherent to every new project, but it also means that a lot of repetitive work has to be done, subtracting valuable time from tackling those more project-specific issues. Leveraging our experience in dApp development, we have identified those repetitive tasks and developed tools that we considered relevant and gather all of them in our web3 Development Starter Kit. We want to contribute to this industry by offering this valuable tool as an open-source project.

This Starter Kit is thought for web3 developers who want to fast-track the early stages of dApp development. It takes an opinionated approach on several libraries, and includes features that are common to several web3 dApps, such as wallet connection, network changes, transaction status handling, Smart Contracts types creation, supporting multiple subgraphs on multiple networks, typed consumption of data from smart contracts, and making contract calls. In addition to web3 helpers, we also provide front-end features such as dynamic loading spinners, token selectors, a basic layout with support for dark and white mode, and some UI components that we hope save valuable developers' time. BootNode's web3 Starter Kit is an open-source project and welcomes all kinds of contributions.

## Features

- Wallet connectivity using [Onboard](https://onboard.blocknative.com/).
- Supported networks and UI indicators when the network is not supported.
- TokenInput with validations [src/components/token/TokenInput.tsx](src/components/token/TokenInput.tsx)
- Spend token [src/components/token/TokenSpend.tsx](src/components/token/TokenSpend.tsx)
- Configurable Token list modal [src/components/token/TokenModal.tsx](src/components/token/TokenModal.tsx)
- Auto-generated types for smart contracts.
- Transactions Life cycle. With homemade toasts.
- Support for connecting with subgraphs.
- Typed hooks to read data from smart contracts.
- Typed hooks to call methods of smart contracts.
- Web3ConnectionProvider: it has many helpers that let you know about the status of a wallet connection.
- React suspense.
- Fetching data through [useSWR](https://swr.vercel.app/).
- Basic layout with support for mobile (menu, sidebar, content).
- Cookie policy banner.
- Many UI components have been created with [styled-components](https://styled-components.com/).
- Light and dark mode.

## Getting Started

You can fork this repo using Github templates. Here is an explanation of how to do it [creating-a-repository-from-a-template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template).

## Installation

1. Install dependencies

```bash
yarn install
```

2. Make a copy of [`.env.example`](./.env.example) to `.env.local` and assign values to the variables

```bash
cp .env.example .env.local
```

> Supported providers are [Alchemy](https://www.alchemy.com/) and [infura](https://infura.io/).

3. Run the app. It will be available at `http://localhost:3000`.

```bash
yarn dev
```

## File structure

This starter is based on [nextjs](https://nextjs.org/docs/getting-started).

Inside the `src` folder you will find:

- `components`: Stateless components. Mostly focused on UI.
- `constants`
- `contracts`: All the contracts your dApp will interact with have to be configured here.
- `hooks`: React hooks.
- `pagePartials`: This folder was thought to be used as a complement to the files in `pages` folder. Sometimes a page can become big and this is the place where helper components related to a particular page will reside. We suggest having one folder per page.
- `providers`: React providers.
- `subgraph`: Queries and configuration for Subgraphs.
- `theme`: general UI styles.
- `utils`: Some utility functions.
- `config`: Global configurations.

## Examples

This starter has been deployed at [https://bn-frontend-starter-kit.vercel.app/](https://bn-frontend-starter-kit.vercel.app/).

There is a section called [examples](https://bn-frontend-starter-kit.vercel.app/examples) where you can play with some of the included components.

If you have forked this repository and don't need this section, you can simply remove the [`examples.tsx`](./pages/examples.tsx) file and the folder [`src/pagePartials/examples`](./src/pagePartials/examples). There is also a Subgraph query example in [`src/subgraph/queries/examples.ts`](./src/subgraph/queries/examples.ts).

## How it works

The main entry point of this starter is the [`src/config/web3.ts`](./src/config/web3.ts) file, where you can set up the supported chains.

```ts
export const Chains = {
  mainnet: 1,
  goerli: 5,
} as const
```

Then, you can start adding the smart-contract you want to interact with. To do so, you need to edit this file [`src/contracts/contracts.ts`](./src/contracts/contracts.ts). Note that you will need to get the ABI. If a new contract is added, you will need to run this script `yarn types-gen`, it will generate the Typescript types for the ABI.

Once your contracts are configured, you can make use of the following react hooks.

- `useContractCall`: will allow you to call a smart-contract method or methods, it is typed, so it will let you know the arguments of the methods as well as the response it returns.

```ts
// first, you need to import the types from the auto-generated types.
import { ERC20, ERC20__factory } from '@/types/typechain'

// create a contract instance. Note that the second parameter is the name we have assigned when we defined the smart-contract in `src/constants/config/contracts.ts`
const erc20 = useContractInstance(ERC20__factory, 'USDC')

// create an array with the methods selectors you want to call.
const calls = [erc20.balanceOf, erc20.decimals] as const

// make use of useContractCall to call them.
const [{ data }, refetch] = useContractCall<ERC20, typeof calls>(calls, [
  [address || ZERO_ADDRESS],
  [],
])

// data will be typed.
const [usdcBalance, usdcDecimals] = data || [ZERO_BN, 18]
```

- `useTransaction`: This hook can be used to trigger a transaction. Using this hook, you don't need to worry about the life cycle of the transaction. It will trigger a toast to inform the user about the status of the TX, handle the case when a user refreshes the page and has pending TXs, and realize if the transaction was replaced.

Following the previous example, this is how an ERC20 transfer can be triggered:

```js
const sendTx = useTransaction()

const tx = erc20.transfer(addressToSend, valueToSend)

try {
  const transaction = await sendTx(tx)
  const receipt = await transaction.wait()
  console.log(receipt)
} catch (error) {
  console.error(error)
}
```

we also provide a Button helper that works like so:

```tsx
<TxButton
  disabled={disableSubmit}
  onMined={(r) => {
    // do something
  }}
  onSend={(tx) => tx && clearForm()}
  tx={() => erc20.transfer(addressToSend, valueToSend)}
>
  Send
</TxButton>
```

## How to add a new smart contract

1. Put your contract ABI file in [`src/contracts/abis`](./src/contracts/abis) as a `.json` file.
2. Go to [`src/contracts/contracts.ts`](./src/contracts/contracts.ts).
3. Provide a key name for your contract in `const contracts = {...}`.
4. Provide a contract address for all the chains you have configured.
5. Import your contract ABI file and add it to the contract key created in step 3.

Example for an ERC20 contract (USDC):

```ts
import ERC_20_abi from '@/src/abis/ERC20.json'

export const contracts = {
  // Other contracts
  USDC: {
    address: {
      [Chains.mainnet]: '0x123...',
      [Chains.goerli]: '0x456...',
    },
    abi: ERC_20_abi,
  },
} as const
```

### Generate contracts types

After adding a new ABI, run `yarn typechain` to generate the types for the contract.
More info can be found at [TypeChain](https://github.com/dethcrypto/TypeChain).

## Subgraph consumption

To interact with a subgraph you should follow these steps:

1. Go to [`src/subgraph/subgraph.ts`](./src/subgraph/subgraph.ts) and a new entry to the `enum subgraphName`.
2. Go to [`src/subgraph/subgraph-endpoints.json`](./src/subgraph/subgraph-endpoints.json) and complete the object following the structure `{ chain: [name: endpoint] }`.

```json
{
  "5": {
    "subgraphName": "subgraph endpoint"
  }
}
```

3. Create queries for the subgraph in the folder [`src/queries`](./src/subgraph/queries). Remember that we already have a [`src/subgraph/queries/examples.ts`](./src/subgraph/queries/examples.ts) that you can use as a guide.
4. run `yarn subgraph-codegen`. This step has to be done every time you add or modify a query.
5. Consume now you will have all the queries typed and available to be called.

```ts
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/constants/config/subgraph'

const { appChainId } = useWeb3Connection()

const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.Rentals)
const res = gql.useSubgraphErrors()
console.log({ res: res.data?._meta }) // res is typed 😎
```

## Theming

We use [styled-components](https://styled-components.com/) to style the Starter Kit, and [sanitize.css](https://github.com/csstools/sanitize.css) is included to provide consistent, cross-browser default styling of HTML elements.

- Add global styles to [`src/theme/globalStyles.tsx`](./src/theme/globalStyles.tsx). Whatever styles you put here will affect the whole app.
- Add properties common to both the light and dark themes (ie: fonts, paddings, margins, etc.) to [`src/theme/common.tsx`](./src/theme/common.tsx).
- Light and dark theming is provided through [`src/theme/light.ts`](./src/theme/light.ts) and [`src/theme/dark.ts`](./src/theme/dark.ts). Ideally, use these files to add **colors only** and nothing else.
- You can set up the default theme (dark or light) using the `NEXT_PUBLIC_DEFAULT_THEME` var in `.env`.

You can use the theme's properties just like with any other components from the Styled Components library using [passed props](https://styled-components.com/docs/basics#passed-props), ie: a simple "paragraph" component:

```tsx
export const Paragraph = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor}; // from light.ts or dark.ts
  font-family: ${({ theme: { fonts } }) => fonts.family}; // from common.ts
  font-size: 1.5rem;
  font-weight: 400;
`
```

## Tokens

We use [Token Lists](https://tokenlists.org/) to provide a list of tokens to the app. You can find the map of tokens sources in [`src/config/web3.ts`](./src/config/web3.ts), at `TokensLists`. You can add a new token source to the map by following the same structure as the other lists.

```ts
export const TokensLists = {
  '1INCH': 'https://gateway.ipfs.io/ipns/tokens.1inch.eth',
  COINGECKO: 'https://tokens.coingecko.com/uniswap/all.json',
  OPTIMISM: 'https://static.optimism.io/optimism.tokenlist.json',
} as const
```

To properly support the token images source, you need to whitelist the domains in [`next.config.js`](./next.config.js), at `images.domains`:

```ts
images: {
  domains: ['tokens.1inch.io', 'ethereum-optimism.github.io', 'assets.coingecko.com']
}
```

To consume them, we implemented the hook [`useTokensLists`](./src/hooks/useTokensLists.tsx). You can find a usage example in [`src/components/token/TokenDropdown.tsx`](./src/components/token/TokenDropdown.tsx). And see it in action in our example page.

## Contributing

Contributions are welcome through [discussions](https://github.com/BootNodeDev/frontend-starter-kit/discussions), [issues](https://github.com/BootNodeDev/frontend-starter-kit/issues) and [pull requests](https://github.com/BootNodeDev/frontend-starter-kit/compare).

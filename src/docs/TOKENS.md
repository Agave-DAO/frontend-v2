# Agave Tokens

The dApp supports a fixed list of tokens and their derived ones.

## ERC20 Tokens
The list of supported tokens can be found in [Agave Docs](https://agavedev.notion.site/Tokens-b8967cb6e8ca43d5b13c7fbabe39fcf7)
These tokens receive the name of _reserve tokens_ in the dApp.

## Token Icons
Are stored in [`public/coins`](/public/coins)

## Reserve Tokens Info
We use a JSON following the token standard specified by TokenLists.org. The file is located in [`public/reserveTokens.json`](/public/reserveTokens.json)

## Protocol Tokens
Each one of the reserve tokens has a series of related tokens (the ones that can be found in [Agave Docs](https://agavedev.notion.site/Tokens-b8967cb6e8ca43d5b13c7fbabe39fcf7))
These tokens receive the name of _protocol tokens_ in the dApp.
The app keeps an updated mapping with that information at [`public/protocolTokens.json`](/public/protocolTokens.json)

## Consume tokens
The dApp exposes a class instance ([agaveTokens](/src/config/agaveTokens.ts)) which understands `Reserve` and `Protocol` tokens, and provides all the required information for them.

In regard to the `Protocol` tokens, the dApp supports: `Interest bearing`, `Variable Debt`, and `Stable Debt` tokens.

## How to Update tokens info
### Delete a token
By just removing the entry of the token from the [`public/reserveTokens.json`](/public/reserveTokens.json) is enough. But we recommend that you also remove the associated icon ([`public/coins`](/public/coins)) and the protocol Tokens info found at [`public/protocolTokens.json`](/public/protocolTokens.json)

### Add a Token
1. You need to add an entry to the [`public/reserveTokens.json`](/public/reserveTokens.json) file, by respecting the following structure.

```json
    {
      "symbol": "GNO",
      "name": "Gnosis",
      "address": "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
      "decimals": 18,
      "chainId": 100,
      "logoURI": "/coins/gno.png"
    }
```

2. Add the icon to the recently added entry to the [`public/coins`](/public/coins) folder.

2. Add an entry to the [`public/protocolTokens.json`](/public/protocolTokens.json) file, by respecting the following structure.

```json
{
  "0x9c58bacc331c9aa871afd802db6379a98e80cedb": {
    "symbol": "GNO",
    "ag": "0xa26783ead6c1f4744685c14079950622674ae8a8",
    "variableDebt": "0x6e2ead844b785a5f44290066ea0ee44338511464",
    "stableDebt": "0xf3779f51b26910a75150999d3517b5360232bb6c",
    "strategy": "0xf785cc3324186df3b00d5ab1b895a345d15e8c2a",
    "oracle": "0x22441d81416430a54336ab28765abd31a792ad37"
  }
}
```

Note 1: `strategy` and `oracle` were added to match the [Agave Docs](https://agavedev.notion.site/Tokens-b8967cb6e8ca43d5b13c7fbabe39fcf7) and are not currently used in the dApp.
Note 2: `symbol` is set to facilitate the cross-reference to the user, but it's not being used in the dApp.
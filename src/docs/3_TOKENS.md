# Agave Tokens

The dApp supports a fixed list of tokens (depending on the market version) and their derived ones.

## ERC20 Tokens

The list of supported tokens can be found in [Agave Docs](https://agavedev.notion.site/Tokens-b8967cb6e8ca43d5b13c7fbabe39fcf7)
These tokens receive the name of _reserve tokens_ in the dApp.

## Token Icons

Are stored in [`public/coins`](/public/coins)

## Reserve Tokens Info

We use a JSON following the token standard specified by TokenLists.org. The files are located in [`public/reserveTokensMain.json`](/public/reserveTokensMain.json), [`public/reserveTokensBoosted.json`](/public/reserveTokensBoosted.json)

## Protocol Tokens

Each one of the reserve tokens has a series of related tokens (the ones that can be found in [Agave Docs](https://agavedev.notion.site/Tokens-b8967cb6e8ca43d5b13c7fbabe39fcf7))
These tokens receive the name of _protocol tokens_ in the dApp.
The app keeps an updated mapping with that information at `extensions.protocolTokens` in [`public/reserveTokensMain.json`](/public/reserveTokensMain.json), [`public/reserveTokensBoosted.json`](/public/reserveTokensBoosted.json)

## Consume tokens

The dApp exposes a class instance ([agaveTokens](/src/config/agaveTokens.ts)) which understands `Reserve` and `Protocol` tokens, and provides all the required information for them.

In regard to the `Protocol` tokens, the dApp supports: `Interest bearing`, `Variable Debt`, and `Stable Debt` tokens.

## How to Update tokens info

### Delete a token

By just removing the entry of the token from the [`public/reserveTokensMain.json`](/public/reserveTokensMain.json) or [`public/reserveTokensBoosted.json`](/public/reserveTokensBoosted.json) is enough. But we recommend that you also remove the associated icon too ([`public/coins`](/public/coins)).

### Add a Token

1. You need to add an entry to the [`public/reserveTokensMain.json`](/public/reserveTokensMain.json) or [`public/reserveTokensBoosted.json`](/public/reserveTokensBoosted.json) files, by respecting the following structure.

```json
{
  "symbol": "GNO",
  "name": "Gnosis",
  "address": "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
  "decimals": 18,
  "chainId": 100,
  "logoURI": "/coins/gno.png",
  "extensions": {
    "isNative": false,
    "isNativeWrapper": false,
    "protocolTokens": {
      "ag": "0xa26783ead6c1f4744685c14079950622674ae8a8",
      "variableDebt": "0x6e2ead844b785a5f44290066ea0ee44338511464",
      "stableDebt": "0xf3779f51b26910a75150999d3517b5360232bb6c"
    }
  }
}
```

2. Add the icon to the recently added entry to the [`public/coins`](/public/coins) folder.

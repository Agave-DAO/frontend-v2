# Market Versions

In this section, we will explain how the DApp supports different market versions. Users can access two versions: "Main" and "Boosted," each with its own set of contracts and functionalities.

### Contract Structure

To support multiple market versions, we organize the contracts as follows (see `src/contracts/contracts.ts`):

```typescript
export enum MarketVersions {
  main = 'main',
  boosted = 'boosted',
}

const mainContracts = {
  // Main contracts here
}

const boostedContracts = {
  // Boosted contracts here
}

const contracts = {
  [MarketVersions.main]: mainContracts,
  [MarketVersions.boosted]: {
    ...mainContracts,
    ...boostedContracts,
  },
}
```

The contracts object contains two properties, **main** and **boosted**, representing the respective market versions. The mainContracts object holds the contracts specific to the main version, while the boostedContracts object contains the contracts specific to the boosted version. By merging these two objects, we ensure that the main version contracts are available in the boosted version, unless explicitly overridden.

### Accessing Market Versions

To access the current market version within your UI components, we provide the `useMarketVersion` hook.

The hook `useContractInstance` read the current market version using `useMarketVersion` hook and return the contract instance of the contract you want to use. Is recommended to use this hook to retrieve all contract instances used in your UI components.

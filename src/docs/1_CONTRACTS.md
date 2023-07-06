# CONTRACTS

In this section, you will learn how to integrate new contracts into the AGAVE DApp. The contracts ABIs are placed in the `src/contracts/abis` directory, and the contract integration is handled in the `src/contracts/contracts.ts` file.

### Adding a New Contract

To add a new contract to the DApp, follow these steps:

1. Place the contract's ABI JSON file in the `src/contracts/abis` directory.

2. Run `yarn typechain` to generate the contract factory types.

3. Open the `src/contracts/contracts.ts` file.

4. Import the contract factory. Make sure to replace `contract_name` with the actual name of the contract.

```typescript
import { contract_name__factory } from '@/types/generated/typechain'

const contracts = {
  contract_name: {
    address: {
      [Chains.gnosis]: '0x...', // Replace [chainID] with the actual chain ID.
    },
    factory: contract_name__factory,
  },
}
```

### Using a Contract

To use a contract, you need to retrieve an instance of the contract. The `useContractInstance` hook is used to retrieve an instance of a contract within your React components. It requires the following parameters:

```typescript
const contractInstance = useContractInstance(factory: ContractFactory, contractKey: string, options?: {
  batch?: boolean,
  useSigner?: boolean
});
```

- **factory**: The contract factory used to create contract instances. Pass the contract factory associated with the contract you want to use.

- **contractKey**: The key representing the contract within the contracts object. Use the name of the contract as specified in the contracts object.

- **options** (optional): Additional options for configuring the contract instance.

  - **batch** (optional): A boolean value indicating whether to use batch requests. Set it to true if you want to enable batch requests. Default is false.

  - **useSigner** (optional): A boolean value indicating whether to use the signer. Set it to true if you want to use the signer for sending transactions. Default is false.

This hook returns an instance of the contract that can be used to interact with the contract's methods and properties.

### Example

```typescript
import { useContractInstance } from '@/hooks/useContractInstance'

const MyComponent = () => {
  const contractInstance = useContractInstance(contracts.contract_name.factory, 'contract_name', {
    batch: true,
    useSigner: true,
  }})

  // Use the contract instance.

  return (
    // JSX code for your component
  )
}
```

If you want to use a contract that is not in the contracts object, you can pass the contract address instead of the contractKey. In this case, make sure you have the appropriate ABI and typings for the contract.

```typescript
import { useContractInstance } from '@/hooks/useContractInstance'
import { contractFactory } from '@/types/generated/typechain'

const MyComponent: React.FC = () => {
  const contractAddress = '0x123abc...'; // Replace with the actual contract address

  const contractInstance = useContractInstance(contractFactory, contractAddress, {
    batch: false,
    useSigner: true
  });

  // Use the contract instance

  return (
    // JSX code for your component
  );
};
```

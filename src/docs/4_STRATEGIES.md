# Strategies

The "Strategies" allows connected users to manage their vaults, including creating and editing vaults, depositing and withdrawing tokens from their vaults, and creating investment strategies using the deposited tokens. Currently, the supported strategies are "Collateral Swap," "Short Position," and "Long Position."

## Adding a New Strategy

To add a new strategy to the interface, you need to make modifications to the following files:

### `src/constants/strategies.json`

This file contains the configuration for the strategies and follows this structure:

```json
{
  "strategies": [
    {
      "slug": "collateral-swap",
      "name": "Collateral Swap",
      "type": "Action"
    },
    {
      "slug": "long",
      "name": "Long",
      "type": "Position"
    },
    {
      "slug": "short",
      "name": "Short",
      "type": "Position"
    }
  ]
}
```

To add a new strategy, add a new object to the strategies array with the following properties:

- **slug**: A unique identifier for the strategy. It should be lowercase and use hyphen-separated words.
- **name**: The display name of the strategy.
- **type**: The type of strategy, such as "Action" or "Position".

Create a new React SVG component for the strategy icon in the `@/src/components/assets/Strategy` directory.
Import the newly created icon component and add it to the mapping of strategies in the strategyIcon object, located in `src/constants/strategiesInfo.tsx`. The strategyIcon object maps the strategy slug to the corresponding React icon component.
For example:

```typescript
import { CollateralSwap } from '@/src/components/assets/CollateralSwap'
import { Long } from '@/src/components/assets/Long'
import { Short } from '@/src/components/assets/Short'
import { NewIcon } from '@/src/components/assets/NewIcon'

export const strategyIcon: Record<Strategy['slug'], ReactElement> = {
  'collateral-swap': <CollateralSwap />,
  long: <Long />,
  short: <Short />,
  'new-strategy': <NewIcon />,
}
```

Once these modifications are made, the new strategy will be available in the interface. However, it will not have any content yet. To add content to the strategy, follow these steps:

Create a new .tsx file in the `src/pages/strategies/` directory with the same name as the slug of the new strategy. All strategies should use the StrategiesLayout layout component, located in `src/pagePartials/strategy/strategies/StrategiesLayout.tsx`.

Create a new folder named `newStrategyName` in src/pagePartials/strategy/strategies/. Inside this folder, create a hooks subfolder and an NewStrategyName.tsx file for the content of the strategy.

From this point, you can start using hooks and components to add content to your new strategy.

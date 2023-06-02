import {
  Dispatch,
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react'

import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { Zero } from '@ethersproject/constants'

import { TextfieldStatus } from '@/src/components/form/Textfield'
import { toWei } from '@/src/utils/common'
import { Token } from '@/types/token'

interface State {
  destinationAmount: string
  destinationPriceInDAI: BigNumber
  destinationStatus?: TextfieldStatus
  destinationStatusText?: string
  destinationToken: Token | null
  originAmount: string
  originBalance: BigNumber
  originPriceInDAI: BigNumber
  originStatus?: TextfieldStatus
  originStatusText?: string
  originToken: Token | null
}

const initialState: State = {
  destinationAmount: '0',
  destinationPriceInDAI: Zero,
  destinationStatus: undefined,
  destinationStatusText: undefined,
  destinationToken: null,
  originAmount: '0',
  originBalance: Zero,
  originPriceInDAI: Zero,
  originStatus: undefined,
  originStatusText: undefined,
  originToken: null,
}

type Action =
  | {
      type: 'SELECT_ORIGIN_TOKEN' | 'SELECT_DESTINATION_TOKEN'
      payload: Token | null
    }
  | {
      type: 'UPDATE_ORIGIN_AMOUNT' | 'UPDATE_DESTINATION_AMOUNT'
      payload: string
    }
  | {
      type: 'UPDATE_ORIGIN_PRICE_IN_DAI' | 'UPDATE_DESTINATION_PRICE_IN_DAI'
      payload: BigNumber
    }
  | {
      type: 'UPDATE_ORIGIN_BALANCE'
      payload: BigNumber
    }
  | {
      type: 'UPDATE_ORIGIN_STATUS' | 'UPDATE_DESTINATION_STATUS'
      payload?: TextfieldStatus
    }
  | {
      type: 'UPDATE_ORIGIN_STATUS_TEXT' | 'UPDATE_DESTINATION_STATUS_TEXT'
      payload?: string
    }
  | {
      type: 'SWITCH_TOKENS'
    }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_ORIGIN_TOKEN':
      return {
        ...state,
        originToken: action.payload,
        originAmount: '0',
        originBalance: Zero,
      }
    case 'SELECT_DESTINATION_TOKEN':
      return {
        ...state,
        destinationToken: action.payload,
        destinationAmount: '0',
      }
    case 'SWITCH_TOKENS':
      return {
        ...state,
        originToken: state.destinationToken,
        destinationToken: state.originToken,
        originAmount: state.destinationAmount,
        originBalance: Zero,
      }
    case 'UPDATE_ORIGIN_AMOUNT':
      return {
        ...state,
        originAmount: action.payload,
      }
    case 'UPDATE_ORIGIN_PRICE_IN_DAI':
      return {
        ...state,
        originPriceInDAI: action.payload,
      }
    case 'UPDATE_ORIGIN_BALANCE':
      return {
        ...state,
        originBalance: action.payload,
      }
    case 'UPDATE_ORIGIN_STATUS':
      return {
        ...state,
        originStatus: action.payload,
      }
    case 'UPDATE_ORIGIN_STATUS_TEXT':
      return {
        ...state,
        originStatusText: action.payload,
      }
    case 'UPDATE_DESTINATION_AMOUNT':
      return {
        ...state,
        destinationAmount: action.payload,
      }
    case 'UPDATE_DESTINATION_PRICE_IN_DAI':
      return {
        ...state,
        destinationPriceInDAI: action.payload,
      }
    case 'UPDATE_DESTINATION_STATUS':
      return {
        ...state,
        destinationStatus: action.payload,
      }
    case 'UPDATE_DESTINATION_STATUS_TEXT':
      return {
        ...state,
        destinationStatusText: action.payload,
      }
    default:
      throw new Error(`Invalid action`)
  }
}

interface CollateralSwapContext {
  computed: {
    destinationSuggestedAmountInWei: BigNumber
  }
  dispatch: Dispatch<Action>
  state: State
}

const CollateralSwapContext = createContext<CollateralSwapContext | undefined>(undefined)

export const CollateralSwapStore: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const computed = useMemo<CollateralSwapContext['computed']>(() => {
    if (
      !state.originToken ||
      !state.originAmount ||
      !state.destinationToken ||
      !state.destinationPriceInDAI.gt(Zero)
    ) {
      return {
        destinationSuggestedAmountInWei: Zero,
      }
    }

    return {
      destinationSuggestedAmountInWei: toWei(
        FixedNumber.fromValue(state.originPriceInDAI)
          .divUnsafe(FixedNumber.fromValue(state.destinationPriceInDAI))
          .mulUnsafe(
            FixedNumber.fromValue(BigNumber.from(state.originAmount), state.originToken.decimals),
          )
          .round(state.destinationToken.decimals)
          .toString(),
        state.destinationToken.decimals,
      ),
    }
  }, [
    state.destinationPriceInDAI,
    state.destinationToken,
    state.originAmount,
    state.originPriceInDAI,
    state.originToken,
  ])

  return (
    <CollateralSwapContext.Provider value={{ computed, dispatch, state }}>
      {children}
    </CollateralSwapContext.Provider>
  )
}

export const useCollateralSwapStore = () => {
  const context = useContext(CollateralSwapContext)

  if (context === undefined) {
    throw new Error('useCollateralSwapStore must be used within a CollateralSwapStore')
  }

  return context
}

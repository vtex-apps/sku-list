import React, { useReducer } from 'react'
import { createContext, useContext } from 'react'
import { Item, Product } from '../typings'

const SkuContext = createContext<State | undefined>(undefined)
const SkuDispatchContext = createContext<Dispatch | undefined>(undefined)

interface State {
  product: Product
  sku: Item
  isHovering: boolean
  isLoading: boolean
  selectedQuantity: number
}

type Dispatch = (action: Action) => void

// type SetProductAction = {
//   type: 'SET_PRODUCT',
//   args: {
//     product: any
//   }
// }

// type SetProductQueryAction = {
//   type: 'SET_PRODUCT_QUERY',
//   args: {
//     query: string
//   }
// }

interface SetHoverAction {
  type: 'SET_HOVER'
  args: {
    isHovering: boolean
  }
}

interface SetLoadingAction {
  type: 'SET_LOADING'
  args: {
    isLoading: boolean
  }
}

// type SetProductQuantity = {
//   type: 'SET_QUANTITY'
//   args: {
//     quantity: number
//   }
// }

type Action = SetHoverAction | SetLoadingAction

export function reducer(state: State, action: Action) {
  switch (action.type) {
    // case 'SET_PRODUCT': {
    //   const product = action.args.product
    //   return {
    //     ...state,
    //     product: product,
    //     //TODO: STOP USING PRODUCT.SKU https://app.clubhouse.io/vtex/story/18547/productsummarycontext-refactor
    //     selectedItem: product.sku
    //   }
    // }
    case 'SET_HOVER': {
      return {
        ...state,
        isHovering: action.args.isHovering,
      }
    }
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.args.isLoading,
      }
    }
    // case 'SET_QUANTITY': {
    //   return {
    //     ...state,
    //     selectedQuantity: action.args.quantity,
    //   }
    // }
    // case 'SET_PRODUCT_QUERY':
    //   return {
    //     ...state,
    //     query: action.args.query,
    //   }
    default:
      return state
  }
}

interface Props {
  sku: Item
  product: Product
  children: any
}

export const SkuProvider = ({ sku, product, children }: Props) => {
  const initialState = {
    product,
    sku,
    isHovering: false,
    isLoading: false,
    selectedQuantity: 1,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <SkuContext.Provider value={state}>
      <SkuDispatchContext.Provider value={dispatch}>{children}</SkuDispatchContext.Provider>
    </SkuContext.Provider>
  )
}

export function useSkuDispatch() {
  const context = useContext(SkuDispatchContext)

  if (context === undefined) {
    throw new Error('useSkuDispatch must be used within a SkuDispatchProvider')
  }

  return context
}

export function useSku() {
  const context = useContext(SkuContext)

  if (context === undefined) {
    throw new Error('useSku must be used within a SkuProvider')
  }

  return context
}

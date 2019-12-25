import React from 'react'
import { useSku } from './SkuContext'
import { Item, Seller } from '../typings'
import { useCssHandles } from 'vtex.css-handles'
import { pathOr } from 'ramda'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = ['inventoryContainer', 'inventory'] as const

const SkuInventory = () => {
  const { sku }: { sku: Item } = useSku()
  const handles = useCssHandles(CSS_HANDLES)
  const inventory: number = sku.sellers
    .map((seller: Seller) =>
      pathOr(0, ['commertialOffer', 'AvailableQuantity'], seller)
    )
    .reduce(
      (accumulator: number, availableQuantity: number) =>
        accumulator + availableQuantity
    )

  return (
    <div className={`${handles.inventoryContainer} lh-copy`}>
      <span className="bold">
        <FormattedMessage id="store.sku-list.inventory.title" />:{' '}
      </span>
      <span className={`${handles.inventory}`}>{inventory}</span>
    </div>
  )
}

export default SkuInventory

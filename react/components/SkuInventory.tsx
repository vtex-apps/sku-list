import React from 'react'
import { useSku } from './SkuContext'
import { Item, Seller } from '../typings'
import { useCssHandles } from 'vtex.css-handles'
import { pathOr } from 'ramda'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = ['inventoryContainer', 'inventory'] as const

interface Props {
  showLabel: boolean
}

const SkuInventory = ({ showLabel }: Props) => {
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
    <div className={`${handles.inventoryContainer} t-body c-muted-1 lh-copy`}>
      {showLabel && (
        <span className="bold">
          <FormattedMessage id="store.sku-list.inventory.title" />:{' '}
        </span>
      )}
      <span className={`${handles.inventory}`}>{inventory}</span>
    </div>
  )
}

SkuInventory.defaultProps = {
  showLabel: true,
}

SkuInventory.schema = {
  title: 'admin/editor.sku-list.inventory.title',
  description: 'admin/editor.sku-list.inventory.description',
  type: 'object',
  properties: {
    showLabel: {
      type: 'boolean',
      title: 'admin/editor.sku-list.inventory.showLabel.title',
      default: true,
      isLayout: false,
    },
  },
}

export default SkuInventory

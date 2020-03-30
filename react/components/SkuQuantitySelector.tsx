import React from 'react'
import { Item } from '../typings'
import { useSku } from './SkuContext'

import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  sku: Item
  selectedQuantity: number
}

const SkuQuantitySelector = () => {
  const { sku, selectedQuantity }: Props = useSku()

  return (
    <div>
      <ExtensionPoint
        id="item-quantity"
        selectedItem={sku}
        selectedQuantity={selectedQuantity}
      />
    </div>
  )
}

export default SkuQuantitySelector

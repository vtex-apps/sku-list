import React from 'react'
import { Item } from '../typings'
import { useSku } from './SkuContext'

import ProductQuantity from 'vtex.product-quantity/ProductQuantity'
// import SKUSelector from 'vtex.store-components/SKUSelector'

interface Props {
  sku: Item
  selectedQuantity: number
}

const SkuQuantitySelector = () => {
  const { sku, selectedQuantity }: Props = useSku()

  return (
    <div>
      {/*<SKUSelector skuItems={[sku]} skuSelected={sku} />*/}
      <ProductQuantity selectedItem={sku} selectedQuantity={selectedQuantity} />
    </div>
  )
}

export default SkuQuantitySelector

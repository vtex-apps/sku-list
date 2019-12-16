import React from 'react'
import { Item, Product, Seller } from '../typings'
import { useSku } from './SkuContext'

import BuyButton from 'vtex.store-components/BuyButton'

import { path } from 'ramda'
// import SKUSelector from 'vtex.store-components/SKUSelector'
// import { ExtensionPoint } from 'vtex.render-runtime'

interface Props {
  sku: Item
  product: Product
  selectedQuantity: number
}

const SkuBuyButton = () => {
  const { sku, product, selectedQuantity }: Props = useSku()

  const isAvailable: boolean =
    (path(
      ['sellers', 0, 'commertialOffer', 'AvailableQuantity'],
      sku
    ) as number) > 0
  const seller: Seller | undefined = path(['sellers', 0], sku)

  const skuItems = BuyButton.mapCatalogItemToCart({
    product,
    selectedQuantity,
    seller,
    sku,
  })

  return (
    <div>
      {/*<ExtensionPoint id="sku-selector" skuItems={[sku]} skuSelected={sku} />*/}
      <BuyButton
        skuItems={skuItems}
        available={isAvailable}
        skuSelected={sku}
      />
    </div>
  )
}

export default SkuBuyButton

import { path, pathOr } from 'ramda'
import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { ExtensionPoint } from 'vtex.render-runtime'
import { Item, Product } from '../typings'

const SkuList = () => {
  const valuesFromContext = useContext(ProductContext)
  const items: Item[] = pathOr([], ['product', 'items'], valuesFromContext)
  const product: Product | undefined = path(['product'], valuesFromContext)

  return (
    <div className="mw9 center">
      {items.map((item: Item) => (
        <ExtensionPoint
          id="sku-content"
          item={item}
          product={product}
          key={`sku-content-${item.itemId}`}
        />
      ))}
    </div>
  )
}

export default SkuList

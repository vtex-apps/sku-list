import React, { ReactNode } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { ExtensionPoint } from 'vtex.render-runtime'
import { Item, Product, Seller } from '../typings'
import { SkuProvider } from './SkuContext'

const CSS_HANDLES = ['skuContentWrapper'] as const

interface Props {
  product: Product
  item: Item
  children?: ReactNode[]
}

const SkuContent = ({ item, product, children }: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <SkuProvider sku={item} product={product}>
      <div className={`${handles.skuContentWrapper} ba b--muted-1 mb3 pa5`}>
        {children}
        {item.sellers.map((seller: Seller) => (
          <ExtensionPoint
            id="sku-seller"
            seller={seller}
            item={item}
            product={product}
            key={`seller-${seller.sellerId}`}
          />
        ))}
      </div>
    </SkuProvider>
  )
}

export default SkuContent

import React from 'react'
import { useSku } from './SkuContext'
import { Item } from '../typings'
import { useCssHandles } from 'vtex.css-handles'
import { path } from 'ramda'
import { FormattedCurrency } from 'vtex.format-currency'

const CSS_HANDLES = ['priceContainer'] as const

const SkuPrice = () => {
  const { sku }: { sku: Item } = useSku()
  const sellingPrice: number | undefined = path(
    ['sellers', 0, 'commertialOffer', 'Price'],
    sku
  )
  const handles = useCssHandles(CSS_HANDLES)

  return sellingPrice ? (
    <div
      className={`pt3 pb5 t-body c-muted-1 lh-copy ${handles.priceContainer}`}>
      <span>
        <FormattedCurrency value={sellingPrice} />
      </span>
    </div>
  ) : (
    <div />
  )
}

export default SkuPrice

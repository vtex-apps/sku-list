import React from 'react'
import { useSkuSeller } from './SkuSellerContext'
import { Seller, Item } from '../typings'
import { useCssHandles } from 'vtex.css-handles'
import { path } from 'ramda'
import { FormattedCurrency } from 'vtex.format-currency'

const CSS_HANDLES = ['sellerPriceContainer'] as const

interface Props {
  seller: Seller
  item: Item
}

const SellerPrice = () => {
  const { seller }: Props = useSkuSeller()
  const sellingPrice: number | undefined = path(
    ['commertialOffer', 'Price'],
    seller
  )
  const handles = useCssHandles(CSS_HANDLES)

  return seller ? (
    <div className={handles.sellerPriceContainer}>
      <span>
        <FormattedCurrency value={sellingPrice} />
      </span>
    </div>
  ) : (
    <div />
  )
}

export default SellerPrice

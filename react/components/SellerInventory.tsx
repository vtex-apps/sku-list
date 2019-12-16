import React from 'react'
import { useSkuSeller } from './SkuSellerContext'
import { Seller } from '../typings'
import { useCssHandles } from 'vtex.css-handles'
import { path } from 'ramda'

const CSS_HANDLES = ['sellerInventoryWrapper', 'sellerInventory'] as const

interface Props {
  seller: Seller
}

const SellerInventory = () => {
  const { seller }: Props = useSkuSeller()
  const handles = useCssHandles(CSS_HANDLES)
  return seller ? (
    <div className={`${handles.sellerInventoryWrapper} lh-copy`}>
      <span className="bold">Inventory: </span>
      <span className={`${handles.sellerInventory}`}>
        {path(['commertialOffer', 'AvailableQuantity'], seller)}
      </span>
    </div>
  ) : (
    <div />
  )
}

export default SellerInventory

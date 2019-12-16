import React from 'react'
import { useSkuSeller } from './SkuSellerContext'
import { Seller } from '../typings'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['sellerName'] as const

interface Props {
  seller: Seller
}

const SellerName = () => {
  const { seller }: Props = useSkuSeller()
  const handles = useCssHandles(CSS_HANDLES)
  return seller ? (
    <h5 className={`${handles.sellerName} t-heading-5 c-muted-1`}>
      {seller.sellerName}
    </h5>
  ) : (
    <div />
  )
}

export default SellerName

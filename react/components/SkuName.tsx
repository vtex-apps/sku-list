import React from 'react'
import { useSku } from './SkuContext'
import { Item } from '../typings'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['skuName'] as const

const SkuName = () => {
  const { sku }: { sku: Item } = useSku()
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <h4 className={`${handles.skuName} t-heading-4 c-muted-1`}>{sku.name}</h4>
  )
}

export default SkuName

import React from 'react'
import { useSkuDispatch } from '../SkuContext'
import BaseProductQuantity from './components/BaseItemQuantity'
import { Item } from '../../typings'

const ItemQuantity: StorefrontFunctionComponent<Props> = ({
  selectedItem,
  warningQuantityThreshold,
  selectedQuantity,
}) => {
  const dispatch = useSkuDispatch()
  return (
    <BaseProductQuantity
      warningQuantityThreshold={warningQuantityThreshold}
      selectedItem={selectedItem}
      selectedQuantity={selectedQuantity}
      dispatch={dispatch}
    />
  )
}

interface Props {
  warningQuantityThreshold: number
  selectedItem: Item
  selectedQuantity: number
}

ItemQuantity.schema = {
  title: 'admin/editor.item-quantity.title',
  description: 'admin/editor.item-quantity.description',
}

export default ItemQuantity

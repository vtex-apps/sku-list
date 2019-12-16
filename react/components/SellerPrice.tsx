import React from 'react'
import { useSkuSeller } from './SkuSellerContext'
import { Seller, Item, PriceBreakResult } from '../typings'
import Loader from './Loader'
import GET_PRICE_BREAKS from '../queries/priceBreaksQuery.graphql'
import SellerPriceBreaks from './SellerPriceBreaks'
import { canUseDOM } from 'vtex.render-runtime'
import { path } from 'ramda'
import { Query } from 'react-apollo'

interface Props {
  seller: Seller
  item: Item
}

const SellerPrice = () => {
  const { seller, item }: Props = useSkuSeller()
  const itemId = path(['itemId'], item)
  const sellerId = path(['sellerId'], seller)
  const measurementUnit = path(['measurementUnit'], item)
  const unitMultiplier = path(['unitMultiplier'], item)
  const getPostalCode = () => {
    return canUseDOM && (localStorage.getItem('userPostalCode') as string)
  }
  return canUseDOM && itemId && sellerId ? (
    <Query
      query={GET_PRICE_BREAKS}
      variables={{
        itemId: itemId,
        sellerId: sellerId,
        postalCode: getPostalCode(),
      }}>
      {({ loading, error, data }: PriceBreakResult) => {
        if ((loading || !data) && !error) return <Loader />
        if (error) return <div>Error Loading prices</div>

        data = {
          ...data,
          ...{ fixedRowsCount: 12, measurementUnit, unitMultiplier },
        }
        return !error ? <SellerPriceBreaks {...data} /> : <div />
      }}
    </Query>
  ) : (
    <div />
  )
}

export default SellerPrice

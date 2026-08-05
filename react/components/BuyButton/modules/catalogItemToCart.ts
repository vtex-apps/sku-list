import { find, path, pathOr, propEq } from 'ramda'

import {
  transformAssemblyOptions,
  sumAssembliesPrice,
  ParsedAssemblyOptionsMeta,
  Option,
} from './assemblyOptions'
import {
  AssemblyOptionItem,
  Item,
  Maybe,
  Product,
  Seller,
} from '../../../typings'

interface MapCatalogItemToCartArgs {
  product: Maybe<Product>
  selectedItem: Maybe<Item>
  quantity: number
  selectedSeller: any
  assemblyOptions?: {
    items: Record<string, AssemblyOptionItem[]>
    inputValues: Record<string, Record<string, string>>
    areGroupsValid: Record<string, boolean>
  }
}

export interface MapCatalogItemToCartReturn {
  index: 0
  quantity: number
  detailUrl: string
  name: string
  brand: string
  category: string
  productRefId: string
  seller: any
  price: number
  listPrice: number
  variant: string
  skuId: string
  imageUrl: string | undefined
  priceToken: string | undefined
  sellingPriceWithAssemblies: number
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
}

export function mapCatalogItemToCart({
  product,
  selectedItem,
  quantity,
  selectedSeller,
  assemblyOptions,
}: MapCatalogItemToCartArgs): MapCatalogItemToCartReturn[] {
  // Signed price from the search response, forwarded on addToCart so the
  // Checkout can close the cart even while the Pricing is unavailable. It has
  // to be read from the very SKU and seller sent on addToCart, since it signs
  // that seller's price for that item
  const sellersFromSelectedItem: Seller[] = pathOr(
    [],
    ['sellers'],
    selectedItem
  )

  const signedSeller = find(
    propEq('sellerId', selectedSeller && selectedSeller.sellerId),
    sellersFromSelectedItem
  )

  // `vtex.search-graphql` exposes it as `priceToken` (>= 0.72.0), while the raw
  // Catalog Search API returns it as `PriceToken`
  const priceToken: string | undefined =
    path(['commertialOffer', 'priceToken'], signedSeller) ||
    path(['commertialOffer', 'PriceToken'], signedSeller)

  return (
    product &&
    selectedItem &&
    selectedSeller &&
    selectedSeller.commertialOffer && [
      {
        index: 0,
        quantity: quantity,
        detailUrl: `/${product.linkText}/p`,
        name: product.productName,
        brand: product.brand,
        category:
          product.categories && product.categories.length > 0
            ? product.categories[0]
            : '',
        productRefId: product.productReference,
        seller: selectedSeller.sellerId,
        price: selectedSeller.commertialOffer.Price,
        listPrice: selectedSeller.commertialOffer.ListPrice,
        variant: selectedItem.name,
        skuId: selectedItem.itemId,
        imageUrl: path(['images', '0', 'imageUrl'], selectedItem),
        priceToken,
        ...transformAssemblyOptions(
          path(['items'], assemblyOptions),
          path(['inputValues'], assemblyOptions),
          selectedSeller.commertialOffer.Price,
          quantity
        ),
        sellingPriceWithAssemblies:
          selectedSeller.commertialOffer.Price +
          sumAssembliesPrice(path(['items'], assemblyOptions) || {}),
      },
    ]
  )
}

import { mapCatalogItemToCart } from '../components/BuyButton/modules/catalogItemToCart'
import { Item, Product, Seller } from '../typings'

const makeSeller = (sellerId: string, priceToken?: string): Seller => ({
  sellerId,
  sellerName: `seller ${sellerId}`,
  commertialOffer: {
    Price: 10,
    ListPrice: 12,
    PriceWithoutDiscount: 12,
    RewardValue: 0,
    AvailableQuantity: 5,
    Installments: [],
    ...(priceToken ? { PriceToken: priceToken } : {}),
  },
})

const makeItem = (sellers: Seller[]): Item => ({
  itemId: '1',
  name: 'SKU name',
  measurementUnit: 'un',
  unitMultiplier: 1,
  images: [],
  variations: [],
  sellers,
})

const product: Product = {
  productId: '1',
  productName: 'Product name',
  productReference: 'ref-1',
  linkText: 'product-name',
  brand: 'Brand',
  brandId: 1,
  items: [],
  categories: ['/Category/'],
}

const mapWith = (sellers: Seller[], selectedSeller: Seller) =>
  mapCatalogItemToCart({
    product,
    selectedItem: makeItem(sellers),
    quantity: 1,
    selectedSeller,
  })[0]

describe('mapCatalogItemToCart priceToken', () => {
  it('takes the price token of the seller sent on addToCart', () => {
    const seller = makeSeller('1', 'signed-price-token')

    expect(mapWith([seller], seller).priceToken).toBe('signed-price-token')
  })

  it('leaves the price token undefined when the search does not return one', () => {
    const seller = makeSeller('1')

    expect(mapWith([seller], seller).priceToken).toBeUndefined()
  })

  it('does not take the price token of another seller', () => {
    const selectedSeller = makeSeller('1')
    const otherSeller = makeSeller('2', 'other-seller-token')

    expect(mapWith([otherSeller], selectedSeller).priceToken).toBeUndefined()
  })

  it('takes the price token of the selected item, not of the product context item', () => {
    const sellerOnSelectedItem = makeSeller('1', 'selected-item-token')
    const sellerOnContextItem = makeSeller('1', 'context-item-token')

    expect(
      mapWith([sellerOnSelectedItem], sellerOnContextItem).priceToken
    ).toBe('selected-item-token')
  })
})

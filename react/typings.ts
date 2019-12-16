import { ApolloError } from 'apollo-client'

export interface Product {
  productId: string
  description?: string
  productName: string
  productReference: string
  linkText: string
  brand: string
  brandId: number
  items: Item[]
}

export interface Item {
  itemId: number
  name: string
  measurementUnit: string
  unitMultiplier: number
  images: Image[]
  sellers: Seller[]
}

export interface Image {
  imageUrls?: string[]
  imageUrl: string
  thresholds?: number[]
  thumbnailUrl?: string
  imageText: string
  imageLabel?: string
  imageTag?: string
}

export interface Seller {
  sellerId: number
  sellerName: string
  commertialOffer: CommercialOffer
}

export interface CommercialOffer {
  Price: number
  ListPrice: number
  PriceWithoutDiscount: number
  RewardValue: number
  AvailableQuantity: number
}

export interface PriceBreaks {
  priceBreaks: PriceBreak[]
}

export interface PriceBreak {
  itemId: string
  maxQuantity: number
  minQuantity: number
  price: number
  leadTime: string
  totalScheduledTime: string
}

export interface PriceBreakResult {
  loading: boolean
  error?: ApolloError
  data: PriceBreaks
}

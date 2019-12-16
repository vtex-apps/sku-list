import { PriceBreak } from '../typings'

export const getPriceBreaksRows = (
  priceBreaks: PriceBreak[],
  maxRows: number
) => {
  const fillEmptyCount =
    maxRows - priceBreaks.length > 0 ? maxRows - priceBreaks.length : 0
  const emptySet =
    fillEmptyCount > 0
      ? [...new Array(fillEmptyCount)].map(() => {
          const priceBreak: PriceBreak = {
            itemId: '',
            maxQuantity: 0,
            minQuantity: 0,
            price: 0,
            leadTime: '',
            totalScheduledTime: '',
          }
          return priceBreak
        })
      : []

  return [...priceBreaks, ...emptySet]
}

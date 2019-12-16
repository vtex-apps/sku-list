import React from 'react'
import {
  CURRENCY_SYMBOL,
  MAX_ROWS_PRODUCT_PRICE_BREAKS_TABLE,
} from '../utils/constants'
import { canUseDOM } from 'vtex.render-runtime'
import { getPriceBreaksRows } from '../utils/priceTableUtils'
import { PriceBreak } from '../typings'
import { formatNumber } from '../utils/numberFormatter'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'productPriceBreaksContainer',
  'productPriceTable',
  'colGroupQuantityBreak',
  'colGroupUnitPrice',
  'colGroupLeadTime',
  'productPriceTableMainHeader',
  'productPricingTableTitle',
  'productPriceTableHeader',
  'productPriceTableHeaderRow',
  'productPriceTableHeaderRowData',
  'productPriceTableRow',
  'productPriceQuantityDataColumn',
  'productPriceTableQuantities',
  'productPriceTablePriceColumn',
  'productPriceTableLeadTimeColumn',
  'productPriceTableFooterRow',
  'productPriceTableFooterMultipleColumn',
  'productPriceBreaksContainer',
] as const

interface Props {
  priceBreaks?: PriceBreak[]
  fixedRowsCount?: number
  unitMultiplier?: number
  measurementUnit?: number
}

const SellerPriceBreaks = ({
  priceBreaks,
  fixedRowsCount,
  unitMultiplier,
  measurementUnit,
}: Props) => {
  const handles = useCssHandles(CSS_HANDLES)
  if (!priceBreaks || priceBreaks.length === 0) {
    return <div> Prices not available </div>
  }

  const maxRows = fixedRowsCount
    ? fixedRowsCount
    : MAX_ROWS_PRODUCT_PRICE_BREAKS_TABLE
  const priceBreaksTableData = getPriceBreaksRows(priceBreaks, maxRows)

  const minimum = priceBreaks[0].minQuantity

  return canUseDOM ? (
    <div className={handles.productPriceBreaksContainer}>
      <table
        className={`${handles.productPriceTable} collapse ba br2 b--black-10 pv2 ph3 w-100`}>
        <colgroup>
          <col className={handles.colGroupQuantityBreak} />
          <col className={handles.colGroupUnitPrice} />
          <col className={handles.colGroupLeadTime} />
        </colgroup>
        <thead className={handles.productPriceTableMainHeader}>
          <tr>
            <th
              className={`${handles.productPricingTableTitle} pa2 tl ttu`}
              colSpan={3}>
              {'Pricing & Availability'}
            </th>
          </tr>
        </thead>
        <thead className={`${handles.productPriceTableHeader}`}>
          <tr
            className={`${handles.productPriceTableHeaderRow} pv2 ph3 tl normal`}>
            <th
              className={`${handles.productPriceTableHeaderRowData} pv2 ph3 tl normal`}>
              Quantity
            </th>
            <th
              className={`${handles.productPriceTableHeaderRowData} pv2 ph3 tl normal`}>
              Unit Price
            </th>
            <th
              className={`${handles.productPriceTableHeaderRowData} pv2 ph3 tl normal`}>
              Arrives in
            </th>
          </tr>
        </thead>
        <tbody>
          {priceBreaksTableData.map((priceBreak: PriceBreak, index: number) => (
            <tr
              className={`${handles.productPriceTableRow}`}
              key={`price-break-${index}`}>
              <td
                className={`${handles.productPriceQuantityDataColumn} pv2 ph3 tl`}>
                <span className={handles.productPriceTableQuantities}>
                  {priceBreak.minQuantity
                    ? `${formatNumber(priceBreak.minQuantity)}
                      ${
                        priceBreak.maxQuantity
                          ? ` - ${formatNumber(priceBreak.maxQuantity)}`
                          : ' +'
                      }`
                    : ''}
                </span>
              </td>
              <td
                className={`${handles.productPriceTablePriceColumn} pv2 ph3 tl`}>
                <span>
                  {priceBreak.price && priceBreak.price > 0
                    ? `${CURRENCY_SYMBOL} ${priceBreak.price}`
                    : ' '}
                </span>
              </td>

              <td
                className={`${handles.productPriceTableLeadTimeColumn} pv2 ph3 tl`}>
                <span>
                  {priceBreak.leadTime
                    ? priceBreak.leadTime.replace(/(\d+)bd/, '$1 days')
                    : ' '}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={`${handles.productPriceTableFooterRow}`}>
            <td
              className={`${handles.productPriceTableFooterMinimumColumn}`}
              colSpan={1}>
              {' '}
              Minimum : {minimum}
            </td>
            <td
              className={`${handles.productPriceTableFooterUOMColumn}`}
              colSpan={2}>
              {' '}
              Unit of measure: {measurementUnit ? measurementUnit : ''}
            </td>
          </tr>
          <tr className={`${handles.productPriceTableFooterRow}`}>
            <td
              className={`${handles.productPriceTableFooterMultipleColumn}`}
              colSpan={3}>
              {' '}
              Multiple : {unitMultiplier ? unitMultiplier : ''}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  ) : (
    <div className={handles.productPriceBreaksContainer} />
  )
}

export default SellerPriceBreaks

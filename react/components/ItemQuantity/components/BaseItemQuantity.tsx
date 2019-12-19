import React, { useCallback } from 'react'
import { NumericStepper } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { pathOr } from 'ramda'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'quantitySelectorContainer',
  'quantitySelectorTitle',
  'quantitySelectorStepper',
  'availableQuantityContainer',
] as const

const BaseItemQuantity: StorefrontFunctionComponent<Props> = ({
  warningQuantityThreshold = 0,
  selectedQuantity,
  selectedItem,
  dispatch,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const onChange = useCallback(
    e => {
      dispatch({ type: 'SET_QUANTITY', args: { quantity: e.value } })
    },
    [dispatch]
  )

  const availableQuantity = pathOr(
    0,
    ['sellers', 0, 'commertialOffer', 'AvailableQuantity'],
    selectedItem
  )

  const showAvailable = availableQuantity <= warningQuantityThreshold

  if (availableQuantity < 1) return null

  return (
    <div
      className={`${handles.quantitySelectorContainer} flex flex-column mb4`}>
      <div className={`${handles.quantitySelectorTitle} mb3 c-muted-2 t-body`}>
        <FormattedMessage id="store/product-quantity.quantity" />
      </div>
      <div className={handles.quantitySelectorStepper}>
        <NumericStepper
          size="small"
          value={selectedQuantity}
          minValue={1}
          maxValue={availableQuantity ? availableQuantity : undefined}
          onChange={onChange}
        />
      </div>
      {showAvailable && (
        <div
          className={`${handles.availableQuantityContainer} mv4 c-muted-2 t-small`}>
          <FormattedMessage
            id="store/product-quantity.quantity-available"
            values={{ availableQuantity }}
          />
        </div>
      )}
    </div>
  )
}

interface Props {
  warningQuantityThreshold: number
  selectedQuantity: number
  selectedItem: any
  dispatch: any
}

BaseItemQuantity.defaultProps = {
  warningQuantityThreshold: 0,
}

export default BaseItemQuantity

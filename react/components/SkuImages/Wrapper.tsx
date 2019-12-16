import React, { useMemo } from 'react'
import { useSku } from '../SkuContext'
import { useResponsiveValues } from 'vtex.responsive-values'
import { path, map, pick } from 'ramda'

import SkuImages, { ZoomProps, Video } from './index'
import generateImageConfig from '../../utils/generateImageConfig'
import {
  THUMBS_ORIENTATION,
  THUMBS_POSITION_HORIZONTAL,
} from '../../utils/enums'
import { Item, Image } from '../../typings'
import { ZoomMode } from './Zoomable'

interface Props {
  aspectRatio?: string
  maxHeight?: string
  images: Image[]
  videos: Video[]
  hiddenImages?: string[]
  position: string
  thumbnailPosition?: string
  displayThumbnailsArrows: boolean
  thumbnailsOrientation: string
  zoomMode?: ZoomMode
  zoomFactor?: number
  zoomProps: ZoomProps
}

const SkuImagesWrapper = (props: Props) => {
  const { aspectRatio, maxHeight } = useResponsiveValues(
    pick(['aspectRatio', 'maxHeight'], props)
  )
  const { sku }: { sku: Item } = useSku()

  const images: Image[] = useMemo(
    () =>
      props.images != null
        ? props.images
        : map(generateImageConfig, path(['images'], sku) || []),
    [props.images, sku]
  )

  const videos: Video[] = useMemo(
    () => (props.videos != null ? props.videos : path(['videos'], sku) || []),
    [props.videos, sku]
  )

  return (
    <SkuImages
      images={images}
      videos={videos}
      zoomProps={props.zoomProps}
      hiddenImages={props.hiddenImages}
      position={props.position || props.thumbnailPosition} //thumbnailPosition is a legacy prop from product-details
      displayThumbnailsArrows={props.displayThumbnailsArrows}
      thumbnailsOrientation={props.thumbnailsOrientation}
      zoomMode={props.zoomMode}
      zoomFactor={props.zoomFactor}
      aspectRatio={aspectRatio}
      maxHeight={maxHeight}
    />
  )
}

SkuImagesWrapper.getSchema = ({
  zoomProps: { zoomType = 'gallery' } = {},
}) => ({
  title: 'admin/editor.product-images.title',
  description: 'admin/editor.product-images.description',
  type: 'object',
  properties: {
    zoomProps: {
      title: 'admin/editor.product-images.zoomOptions.title',
      type: 'object',
      properties: {
        zoomType: {
          title: 'admin/editor.product-images.zoomType.title',
          type: 'string',
          enum: ['gallery', 'in-page', 'no-zoom'],
          enumNames: [
            'admin/editor.product-images.gallery',
            'admin/editor.product-images.in-page',
            'admin/editor.product-images.no-zoom',
          ],
          widget: {
            'ui:options': {
              inline: false,
            },
            'ui:widget': 'radio',
          },
          default: 'no-zoom',
        },
        ...(zoomType === 'gallery' && {
          bgOpacity: {
            title: 'admin/editor.product-images.bgopacity.title',
            type: 'number',
            minimum: 0.0,
            maximum: 1.0,
            multipleOf: 0.01,
            default: 0.8,
          },
        }),
      },
    },
    thumbnailsOrientation: {
      title: 'admin/editor.product-images.thumbnailsOrientation.title',
      type: 'string',
      enum: [THUMBS_ORIENTATION.VERTICAL, THUMBS_ORIENTATION.HORIZONTAL],
      enumNames: [
        'admin/editor.product-images.vertical',
        'admin/editor.product-images.horizontal',
      ],
      widget: {
        'ui:options': {
          inline: false,
        },
        'ui:widget': 'radio',
      },
      default: THUMBS_ORIENTATION.VERTICAL,
      isLayout: true,
    },
    position: {
      title: 'admin/editor.product-images.position.title',
      description: 'admin/editor.product-images.position.description',
      type: 'string',
      enum: [THUMBS_POSITION_HORIZONTAL.LEFT, THUMBS_POSITION_HORIZONTAL.RIGHT],
      enumNames: [
        'admin/editor.product-images.left',
        'admin/editor.product-images.right',
      ],
      widget: {
        'ui:options': {
          inline: false,
        },
        'ui:widget': 'radio',
      },
      default: THUMBS_POSITION_HORIZONTAL.LEFT,
      isLayout: true,
    },
    displayThumbnailsArrows: {
      title: 'admin/editor.product-images.displayThumbnailsArrows.title',
      type: 'boolean',
      default: false,
      isLayout: true,
    },
  },
})

export default SkuImagesWrapper

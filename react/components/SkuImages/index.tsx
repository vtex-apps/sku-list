import React, { useMemo } from 'react'
import Carousel, { Slide } from './Carousel'
import { useCssHandles } from 'vtex.css-handles'
import {
  THUMBS_POSITION_HORIZONTAL,
  THUMBS_ORIENTATION,
  DEFAULT_EXCLUDE_IMAGE_WITH,
} from '../../utils/enums'
import { ZoomMode } from './Zoomable'
import { pathOr } from 'ramda'
import { Image } from '../../typings'

const CSS_HANDLES = ['content'] as const

export interface Video {
  videoUrl: string
}

export interface ZoomProps {
  zoomType?: string
}

interface Props {
  position: string
  displayThumbnailsArrows: boolean
  hiddenImages?: string[]
  images?: Image[]
  videos?: Video[]
  thumbnailsOrientation: string
  aspectRatio?: string
  maxHeight?: number
  zoomMode?: ZoomMode
  zoomFactor?: number
  zoomProps?: ZoomProps
}

const SkuImages = ({
  position,
  displayThumbnailsArrows,
  hiddenImages,
  images = [],
  videos = [],
  thumbnailsOrientation,
  aspectRatio,
  maxHeight,
  zoomMode,
  zoomFactor,
  zoomProps,
}: Props) => {
  if (hiddenImages && !Array.isArray(hiddenImages)) {
    hiddenImages = [hiddenImages]
  }

  const excludeImageRegexes =
    hiddenImages && hiddenImages.map(text => new RegExp(text, 'i'))

  const allImages = images.filter(
    (image: Image) =>
      !image.imageLabel ||
      (excludeImageRegexes &&
        !excludeImageRegexes.some(regex =>
          regex.test(pathOr('', ['imageLabel'], image))
        ))
  )

  const slides: Slide[] = useMemo(() => {
    if (!allImages.length && !videos.length) {
      return []
    }

    return [
      ...allImages.map((image: Image) => ({
        type: 'image',
        url: image.imageUrls ? image.imageUrls[0] : image.imageUrl,
        alt: image.imageText,
        thumbUrl: image.thumbnailUrl || image.imageUrl,
      })),
      ...videos.map((video: Video) => ({
        type: 'video',
        url: video.videoUrl,
        alt: '',
        thumbUrl: '',
        thumbWidth: 300,
      })),
    ]
  }, [allImages, videos])

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.content} w-100`}>
      <Carousel
        slides={slides}
        position={position}
        displayThumbnailsArrows={displayThumbnailsArrows}
        thumbnailsOrientation={thumbnailsOrientation}
        aspectRatio={aspectRatio}
        maxHeight={maxHeight}
        zoomMode={zoomMode}
        zoomFactor={zoomFactor}
        // Deprecated
        zoomProps={zoomProps}
      />
    </div>
  )
}

SkuImages.defaultProps = {
  images: [],
  position: THUMBS_POSITION_HORIZONTAL.LEFT,
  zoomProps: { zoomType: 'in-page' },
  thumbnailsOrientation: THUMBS_ORIENTATION.VERTICAL,
  displayThumbnailsArrows: false,
  hiddenImages: DEFAULT_EXCLUDE_IMAGE_WITH,
}

export default SkuImages

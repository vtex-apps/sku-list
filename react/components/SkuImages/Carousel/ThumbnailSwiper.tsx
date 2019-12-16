import React from 'react'
import { THUMB_SIZE, imageUrlForSize } from '../modules/images'
import classNames from 'classnames'
import { THUMBS_POSITION_HORIZONTAL } from '../../../utils/enums'
import { useCssHandles } from 'vtex.css-handles'
import styles from '../../../styles.css'

const CSS_HANDLES = ['figure', 'carouselGaleryThumbs', 'carouselThumbBorder']

/** Swiper and its modules are imported using require to avoid breaking SSR */
const Swiper = window.navigator ? require('react-id-swiper/lib/ReactIdSwiper.full').default : null

interface ThumbnailProps {
  itemContainerClasses: string
  gallerySwiper: any
  alt: string
  thumbUrl: string
  height: string
  index: number
}

interface Slide {
  thumbUrl: string
  alt: string
}

export interface SwiperParams {
  containerClass: string
  direction: string
  freeMode: boolean
  getSwiper: (swiper: any) => void
  modules: any
  mousewheel: boolean
  observer: boolean
  preloadImages: boolean
  shouldSwiperUpdate: boolean
  slidesPerGroup: number
  slidesPerView: string
  threshold: number
  touchRatio: number
  watchSlidesProgress: boolean
  watchSlidesVisibility: boolean
  zoom: boolean
}

interface ThumbnailSwiperProps {
  isThumbsVertical: boolean
  slides: Slide[]
  swiperParams: SwiperParams
  thumbUrls: string[]
  position: string
  gallerySwiper: any
  activeIndex: number
}

const Thumbnail = ({
  itemContainerClasses,
  gallerySwiper,
  alt,
  thumbUrl,
  height,
  index,
}: ThumbnailProps) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div
      className={itemContainerClasses}
      style={{ height }}
      onClick={() => gallerySwiper && gallerySwiper.slideTo(index)}>
      <figure
        className={styles.figure}
        itemProp="associatedMedia"
        itemScope
        itemType="http://schema.org/ImageObject">
        <img
          className="w-100 h-auto db"
          itemProp="thumbnail"
          alt={alt}
          src={imageUrlForSize(thumbUrl, THUMB_SIZE)}
        />
      </figure>
      <div
        className={`absolute absolute--fill b--solid b--muted-2 bw1 ${handles.carouselThumbBorder}`}
      />
    </div>
  )
}

const ThumbnailSwiper = ({
  isThumbsVertical,
  slides,
  swiperParams,
  thumbUrls,
  position,
  gallerySwiper,
  activeIndex,
}: ThumbnailSwiperProps) => {
  const hasThumbs = slides.length > 1

  // const handles = useCssHandles(CSS_HANDLES)

  const thumbClasses = classNames(`${styles.carouselGaleryThumbs} dn`, {
    'db-ns': hasThumbs,
    mt3: !isThumbsVertical,
    'w-20 bottom-0 top-0 absolute': isThumbsVertical,
    'left-0 pr5': isThumbsVertical && position === THUMBS_POSITION_HORIZONTAL.LEFT,
    'right-0 pl5': isThumbsVertical && position === THUMBS_POSITION_HORIZONTAL.RIGHT,
  })

  return (
    <div className={thumbClasses} data-testid="thumbnail-swiper">
      <Swiper {...swiperParams} rebuildOnUpdate>
        {slides.map((slide, i) => {
          const itemContainerClasses = classNames('swiper-slide mb5 pointer', {
            'w-20': !isThumbsVertical,
            'w-100': isThumbsVertical,
            'swiper-slide-active': activeIndex === i,
          })

          return (
            <Thumbnail
              key={`${i}-${slide.alt}`}
              itemContainerClasses={itemContainerClasses}
              index={i}
              height={isThumbsVertical ? 'auto' : '115px'}
              gallerySwiper={gallerySwiper}
              alt={slide.alt}
              thumbUrl={slide.thumbUrl || thumbUrls[i]}
            />
          )
        })}
      </Swiper>
    </div>
  )
}

export default ThumbnailSwiper

import React, { Component, ReactElement } from 'react'
import debounce from 'debounce'
import classNames from 'classnames'
import { path, pathOr, equals } from 'ramda'
import ReactResizeDetector from 'react-resize-detector'

import { IconCaret } from 'vtex.store-icons'

import Video from '../Video'
import SkuImage from '../SkuImage'

import ThumbnailSwiper, { SwiperParams } from './ThumbnailSwiper'
import {
  THUMBS_ORIENTATION,
  THUMBS_POSITION_HORIZONTAL,
} from '../../../utils/enums'
import { ZoomMode } from '../Zoomable'

import styles from '../../../styles.css'

import { withCssHandles } from 'vtex.css-handles'

import './global.css'

const CSS_HANDLES = [
  'carouselCursorDefault',
  'carouselIconCaretRight',
  'carouselIconCaretLeft',
  'gradientBaseBottom',
  'gradientBaseRight',
  'gradientBaseTop',
  'gradientBaseLeft',
  'carouselGaleryCursor',
] as const

/**
 * ReactIdSwiper cannot be SSRendered, so this is a fake swiper that copies some of its classes and HTML layout and render only the first image of the children array.
 */
const FakeSwiper = ({
  children,
  containerClass,
  direction = THUMBS_ORIENTATION.HORIZONTAL,
}: {
  children: ReactElement[]
  containerClass: string
  direction: string
}) => {
  const swiperContainerDirection =
    direction === THUMBS_ORIENTATION.HORIZONTAL
      ? 'swiper-container-horizontal'
      : direction === THUMBS_ORIENTATION.VERTICAL
      ? 'swiper-container-vertical'
      : ''
  const childrenArray = React.Children.toArray(children)
  if (childrenArray.length === 0) {
    return null
  }
  const child: ReactElement = childrenArray[0]
  const childClass = path(['props', 'className'], child)
  const newChildClass = childClass
    ? `${childClass} swiper-slide-active`
    : childClass
  return (
    <div
      className={`${containerClass} swiper-container-initialized ${swiperContainerDirection}`}>
      <div className="swiper-wrapper">
        {React.cloneElement(child, {
          className: newChildClass,
        })}
      </div>
    </div>
  )
}

/** Swiper and its modules are imported using require to avoid breaking SSR */
const Swiper = window.navigator
  ? require('react-id-swiper/lib/ReactIdSwiper').default
  : FakeSwiper
const SwiperModules = window.navigator ? require('swiper/dist/js/swiper') : null

export interface Slide {
  type?: string
  url: string
  alt: string
  thumbUrl: string
  bestUrlIndex?: number
  thumbWidth?: number
}

interface Zoom {
  zoomType: string
}

interface Props {
  slides: Slide[]
  aspectRatio?: string
  maxHeight?: number
  zoomMode?: ZoomMode
  zoomFactor?: number
  displayThumbnailsArrows: boolean
  thumbSwiper?: any
  gallerySwiper?: any
  thumbnailsOrientation: string
  position: string
  zoomProps: Zoom
  cssHandles: any
  thumbnailAspectRatio: string
  thumbnailMaxHeight: number
}

interface State {
  loaded: boolean[]
  thumbUrl: string[]
  alt: string[]
  thumbsLoaded: boolean
  activeIndex: number
  thumbSwiper: any
  gallerySwiper: any
  sliderChanged: boolean
}

const initialState: {
  loaded: any[]
  activeIndex: number
  thumbsLoaded: boolean
  alt: string[]
  thumbUrl: string[]
} = {
  loaded: [],
  thumbUrl: [],
  alt: [],
  thumbsLoaded: false,
  activeIndex: 0,
}

class Carousel extends Component<Props, State> {
  private isVideo: boolean[] = []
  private thumbLoadCount: number = 0
  public state = {
    ...initialState,
    thumbSwiper: null,
    gallerySwiper: null,
    sliderChanged: false,
  }

  public async setInitialVariablesState() {
    const slides = this.props.slides || []

    this.isVideo = []
    this.thumbLoadCount = 0

    slides.forEach(async (slide, i) => {
      if (slide.type === 'video') {
        const thumbUrl = await Video.getThumbUrl(slide.url)
        this.isVideo[i] = true
        this.setVideoThumb(i)(thumbUrl, i.toString())
        this.thumbLoadFinish()
      } else {
        this.getThumb(slide.thumbUrl)
      }
    })
  }

  public updateSwiperSize = debounce(() => {
    const { thumbSwiper, gallerySwiper } = this.state
    if (thumbSwiper) {
      // @ts-ignore
      thumbSwiper.update()
    }

    if (gallerySwiper) {
      // @ts-ignore
      gallerySwiper.update()
    }
  }, 500)

  public thumbLoadFinish = () => {
    this.thumbLoadCount++
    if (
      !this.props.slides ||
      this.thumbLoadCount === this.props.slides.length
    ) {
      this.setState({ thumbsLoaded: true })
    }
  }

  public getThumb = (thumbUrl: string) => {
    if (!window.navigator) return // Image object doesn't exist when it's being rendered in the server side
    const image = new Image()
    image.onload = () => {
      this.thumbLoadFinish()
    }
    image.onerror = () => {
      this.thumbLoadFinish()
    }
    image.src = thumbUrl
  }

  public handleResize = () => {
    this.updateSwiperSize()
  }

  public componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.setInitialVariablesState()
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)

    this.updateSwiperSize.clear()
  }

  public componentDidUpdate(prevProps: Props) {
    const { loaded, activeIndex, gallerySwiper, thumbSwiper } = this.state
    const isVideo = this.isVideo

    if (!equals(prevProps.slides, this.props.slides)) {
      this.setInitialVariablesState()
      this.setState(initialState)
      if (this.props.slides && this.props.slides.length > 1) {
        // @ts-ignore
        gallerySwiper && gallerySwiper.slideTo(0)
        // @ts-ignore
        thumbSwiper && thumbSwiper.slideTo(0)
      }
      return
    }

    const paginationElement: any = path(['pagination', 'el'], gallerySwiper)
    if (paginationElement) paginationElement.hidden = isVideo[activeIndex]

    const gallerySwiperZoom: any = path(['zoom'], gallerySwiper)

    if (gallerySwiperZoom) {
      loaded[activeIndex]
        ? gallerySwiperZoom.enable()
        : gallerySwiperZoom.disable()
    }
  }

  public onSlideChange = () => {
    const activeIndex: number = pathOr(
      0,
      ['activeIndex'],
      this.state.gallerySwiper
    )
    this.setState({ activeIndex, sliderChanged: true })
  }

  public setVideoThumb = (i: number) => (url: string, title: string) => {
    const thumbUrl: string[] = { ...this.state.thumbUrl }
    const alt: string[] = { ...this.state.alt }

    thumbUrl[i] = url
    alt[i] = title

    this.setState({ thumbUrl, alt })
  }

  public renderSlide = (slide: Slide, i: number) => {
    const { aspectRatio, maxHeight, zoomMode, zoomFactor } = this.props

    // Backwards compatibility
    // const { zoomType: legacyZoomType } = legacyZoomProps || {}
    // const isZoomDisabled = legacyZoomType === 'no-zoom' || zoomMode === 'disabled'

    switch (slide.type) {
      case 'image':
        return (
          <SkuImage
            src={slide.url}
            alt={slide.alt}
            aspectRatio={aspectRatio}
            maxHeight={maxHeight}
            zoomFactor={zoomFactor}
            zoomMode={zoomMode}
          />
        )
      case 'video':
        return (
          <Video
            url={slide.url}
            setThumb={this.setVideoThumb(i)}
            playing={i === this.state.activeIndex}
            id={i}
            thumbWidth={100}
          />
        )
      default:
        return null
    }
  }

  public galleryParams = () => {
    const { thumbSwiper } = this.state
    const { slides = [] } = this.props

    const iconSize = 24
    const caretClassName =
      'pv8 absolute top-50 translate--50y z-2 pointer c-action-primary'

    // const { cssHandles } = this.props

    return {
      modules: [SwiperModules.Pagination, SwiperModules.Navigation],
      containerClass: 'swiper-container',
      ...(slides.length > 1 && {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          bulletActiveClass: 'c-action-primary swiper-pagination-bullet-active',
        },
      }),
      ...(slides.length > 1 && {
        navigation: {
          prevEl: '.swiper-caret-prev',
          nextEl: '.swiper-caret-next',
          disabledClass: `c-disabled ${styles.carouselCursorDefault}`,
        },
      }),
      thumbs: {
        swiper: thumbSwiper,
      },
      threshold: 10,
      resistanceRatio: slides.length > 1 ? 0.85 : 0,
      renderNextButton: () => (
        <span className={`swiper-caret-next pl7 pr2 right-0 ${caretClassName}`}>
          <IconCaret
            orientation="right"
            size={iconSize}
            className={styles.carouselIconCaretRight}
          />
        </span>
      ),
      renderPrevButton: () => (
        <span className={`swiper-caret-prev pr7 pl2 left-0 ${caretClassName}`}>
          <IconCaret
            orientation="left"
            size={iconSize}
            className={styles.carouselIconCaretLeft}
          />
        </span>
      ),
      on: {
        slideChange: this.onSlideChange,
      },
      getSwiper: (swiper: any) => this.setState({ gallerySwiper: swiper }),
    }
  }

  public thumbnailsParams = (): SwiperParams => {
    const { displayThumbnailsArrows, thumbnailsOrientation } = this.props

    const isThumbsVertical =
      thumbnailsOrientation === THUMBS_ORIENTATION.VERTICAL
    const caretSize = 24
    const caretClassName = 'absolute z-2 pointer c-action-primary flex pv2'
    const caretStyle = { transition: 'opacity 200ms' }

    // const { cssHandles } = this.props

    return {
      modules: [SwiperModules.Navigation],
      ...(displayThumbnailsArrows && {
        navigation: {
          prevEl: '.swiper-thumbnails-caret-prev',
          nextEl: '.swiper-thumbnails-caret-next',
          disabledClass: `c-disabled o-0 pointer-events-none ${styles.carouselCursorDefault}`,
          hiddenClass: 'dn',
        },
        renderNextButton: () => {
          const classes = classNames(
            'swiper-thumbnails-caret-next',
            caretClassName,
            {
              [`bottom-0 pt7 left-0 justify-center w-100 ${styles.gradientBaseBottom}`]: isThumbsVertical,
              [`right-0 top-0 items-center h-100 pl6 ${styles.gradientBaseRight}`]: !isThumbsVertical,
            }
          )
          return (
            <span className={classes} style={caretStyle}>
              <IconCaret
                orientation={isThumbsVertical ? 'down' : 'right'}
                size={caretSize}
              />
            </span>
          )
        },
        renderPrevButton: () => {
          const classes = classNames(
            'swiper-thumbnails-caret-prev top-0 left-0',
            caretClassName,
            {
              [`pb7 justify-center w-100 ${styles.gradientBaseTop}`]: isThumbsVertical,
              [`items-center h-100 pr6 ${styles.gradientBaseLeft}`]: !isThumbsVertical,
            }
          )
          return (
            <span className={classes} style={caretStyle}>
              <IconCaret
                orientation={isThumbsVertical ? 'up' : 'left'}
                size={caretSize}
              />
            </span>
          )
        },
      }),
      observer: true,
      containerClass: 'swiper-container h-100',
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      freeMode: false,
      direction: thumbnailsOrientation,
      slidesPerView: 'auto',
      touchRatio: 1,
      mousewheel: false,
      preloadImages: true,
      shouldSwiperUpdate: true,
      zoom: false,
      threshold: 8,
      /* Slides are grouped when thumbnails arrows are enabled
       * so that clicking on next/prev will scroll more than
       * one thumbnail */
      slidesPerGroup: displayThumbnailsArrows ? 4 : 1,
      getSwiper: (swiper: any) => this.setState({ thumbSwiper: swiper }),
    }
  }

  public render() {
    const { thumbsLoaded, gallerySwiper, activeIndex } = this.state

    const {
      position,
      cssHandles,
      slides = [],
      thumbnailMaxHeight,
      thumbnailAspectRatio,
      thumbnailsOrientation,
      zoomProps: { zoomType },
    } = this.props

    if (!thumbsLoaded || Swiper == null) {
      return null
    }

    const isThumbsVertical: boolean =
      thumbnailsOrientation === THUMBS_ORIENTATION.VERTICAL
    const hasThumbs: boolean = slides && slides.length > 1

    // const { cssHandles } = this.props

    const galleryCursor: any = {
      'in-page': styles.carouselGaleryCursor,
      'no-zoom': '',
    }

    const imageClasses = classNames(
      'w-100 border-box',
      galleryCursor[zoomType],
      {
        'ml-20-ns w-80-ns':
          isThumbsVertical &&
          position === THUMBS_POSITION_HORIZONTAL.LEFT &&
          hasThumbs,
        'mr-20-ns w-80-ns':
          isThumbsVertical &&
          position === THUMBS_POSITION_HORIZONTAL.RIGHT &&
          hasThumbs,
      }
    )

    const thumbnailSwiper = thumbsLoaded && hasThumbs && (
      <ThumbnailSwiper
        isThumbsVertical={isThumbsVertical}
        slides={slides}
        activeIndex={activeIndex}
        swiperParams={this.thumbnailsParams()}
        thumbUrls={this.state.thumbUrl}
        position={position}
        gallerySwiper={gallerySwiper}
        thumbnailAspectRatio={thumbnailAspectRatio}
        thumbnailMaxHeight={thumbnailMaxHeight}
      />
    )

    const containerClasses = classNames(
      cssHandles.carouselContainer,
      'relative overflow-hidden w-100',
      {
        'flex-ns justify-end-ns':
          isThumbsVertical &&
          position === THUMBS_POSITION_HORIZONTAL.LEFT &&
          hasThumbs,
        'flex-ns justify-start-ns':
          isThumbsVertical &&
          position === THUMBS_POSITION_HORIZONTAL.RIGHT &&
          hasThumbs,
      }
    )

    const SliderComponent = slides.length === 1 ? FakeSwiper : Swiper

    return (
      <div className={containerClasses} aria-hidden="true">
        {isThumbsVertical && thumbnailSwiper}
        <div className={imageClasses}>
          <ReactResizeDetector handleHeight onResize={this.updateSwiperSize}>
            <SliderComponent {...this.galleryParams} shouldSwiperUpdate>
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className={`${cssHandles.productImagesGallerySlide} swiper-slide center-all`}>
                  {this.renderSlide(slide, i)}
                </div>
              ))}
            </SliderComponent>
          </ReactResizeDetector>
          {!isThumbsVertical && thumbnailSwiper}
        </div>
      </div>
    )
  }
}

export default withCssHandles(CSS_HANDLES)(Carousel)

import React, { Component } from 'react'
import { match, compose, isEmpty, complement } from 'ramda'

import Vimeo from './Vimeo'
import YouTube from './Youtube'

import { withCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['video']

const isNotEmpty = complement(isEmpty)

const isVimeo = compose(
  isNotEmpty,
  match(/vimeo/)
)
const isYoutube = compose(
  isNotEmpty,
  match(/youtube|youtu.be/)
)

interface Props {
  url: string
  id: number
  setThumb: (thumbUrl: string, title: string) => void
  thumbWidth: number
  className?: string
  playing?: boolean
  cssHandles: any
}

class Video extends Component<Props> {
  public static getThumbUrl(url: string) {
    if (isVimeo(url)) {
      return Vimeo.getThumbUrl(url)
    } else if (isYoutube(url)) {
      return YouTube.getThumbUrl(url)
    }
    return url
  }

  public render() {
    const { url, cssHandles } = this.props

    return (
      <div className={cssHandles.video}>
        {isVimeo(url) && <Vimeo {...this.props} />}
        {isYoutube(url) && <YouTube {...this.props} />}
      </div>
    )
  }
}

const VideoWithCssHandles = withCssHandles(CSS_HANDLES)(Video)

VideoWithCssHandles.getThumbUrl = Video.getThumbUrl

export default VideoWithCssHandles

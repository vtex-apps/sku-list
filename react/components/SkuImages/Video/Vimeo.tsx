import React, { Component } from 'react'

interface Props {
  loop?: boolean
  autoplay?: boolean
  title?: string
  url: string
  className: string
  id: number
  playing?: boolean
  setThumb: (thumbUrl: string, title: string) => void
  thumbWidth: number
  showTitle?: boolean
  width?: number
  height?: number
}

interface State {
  iframe: any
}

interface Response {
  width: number
  height: number
  thumbnail_url_with_play_button: string
  thumbnail_width: number
}

class Vimeo extends Component<Props, State> {
  private readonly iframeRef: any
  private frameReady: boolean = false

  public static defaultProps = {
    loop: true,
    autoplay: false,
    width: null,
    height: null,
    showTitle: false,
    className: '',
  }

  public constructor(props: Props) {
    super(props)

    this.state = { iframe: {} }

    const { loop, autoplay, width, height, showTitle, url } = this.props
    const params = `autoplay=${autoplay}&loop=${loop}&title=${showTitle}&width=${width}&height=${height}`
    const getUrl = `https://vimeo.com/api/oembed.json?url=${url}&${params}`

    this.iframeRef = React.createRef()

    fetch(getUrl)
      .then(response => response.json())
      .then(response => {
        const { height, width, html, title } = response

        const thumbUrl = Vimeo.thumbUrlFromResp(response, props.thumbWidth)
        props.setThumb && props.setThumb(thumbUrl, title)

        const src = html.match(/src= *" *([^"]*) *"/)[1] // Get url from response

        this.setState({
          iframe: {
            divStyle: { padding: `${(100 * height) / width}% 0 0 0` },
            src: src,
          },
        })
      })
  }

  public static getThumbUrl = async (url: string) => {
    const getUrl = `https://vimeo.com/api/oembed.json?url=${url}`
    const response = await fetch(getUrl)
    const responseJson = await response.json()
    return responseJson.thumbnail_url
  }

  public static thumbUrlFromResp(response: Response, thumbWidth: number) {
    const { height, width } = response
    const thumb = response.thumbnail_url_with_play_button

    thumbWidth = thumbWidth || response.thumbnail_width
    const thumbHeight = Math.ceil((thumbWidth * height) / width)

    return thumb.replace(
      /_[0123456789]*x[0123456789]*./,
      `_${thumbWidth}x${thumbHeight}.`
    )
  }

  public executeCommand = (command: any) => () => {
    if (!this.frameReady) return

    const vimeoCommand = JSON.stringify({ method: command })
    this.iframeRef.contentWindow.postMessage(
      vimeoCommand,
      'https://player.vimeo.com'
    )
  }

  public render() {
    const { iframe } = this.state
    const { className, id } = this.props

    this.props.playing
      ? this.executeCommand('play')()
      : this.executeCommand('pause')()

    return (
      <div style={iframe.divStyle} className={`relative ${className}`}>
        <iframe
          ref={this.iframeRef}
          title={id.toString()}
          className="absolute top-0 left-0 w-100 h-100"
          src={iframe.src}
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
        />
      </div>
    )
  }
}

export default Vimeo

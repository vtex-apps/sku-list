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
  thumbWidth?: number
  showTitle?: boolean
  width?: number
  height?: number
}

interface State {
  iframe: any
}

class Youtube extends Component<Props, State> {
  private readonly iframeRef: any
  private frameReady: boolean = false

  public static defaultProps = {
    loop: true,
    autoplay: false,
    width: null,
    height: null,
    title: false,
    className: '',
  }

  public constructor(props: Props) {
    super(props)

    const { loop, autoplay, title, url } = this.props
    const params = `autoplay=${autoplay}&loop=${loop}&title=${title}&enablejsapi=1&iv_load_policy=3&modestbranding=1`
    const videoId = Youtube.extractVideoID(url)

    this.iframeRef = React.createRef()
    this.state = {
      iframe: {
        src: `https://www.youtube.com/embed/${videoId}?${params}`,
      },
    }
  }

  public static getThumbUrl = (url: string) => {
    const videoId = Youtube.extractVideoID(url)
    return Promise.resolve(`https://img.youtube.com/vi/${videoId}/default.jpg`)
  }

  public static extractVideoID = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    if (match && match[7].length === 11) return match[7]
    return null
  }

  public executeCommand = (command: any) => () => {
    if (!this.frameReady) return

    const youtubeCommand: string = JSON.stringify({
      event: 'command',
      func: command,
    })
    this.iframeRef.contentWindow.postMessage(
      youtubeCommand,
      'https://www.youtube.com'
    )
  }

  public render() {
    const { iframe } = this.state
    const { className, id } = this.props

    this.props.playing
      ? this.executeCommand('playVideo')()
      : this.executeCommand('pauseVideo')()

    return (
      <div className={`relative ${className}`} style={{ padding: '30%' }}>
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

export default Youtube

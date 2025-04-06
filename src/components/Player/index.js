import { useStore } from "@/contexts";
import storage from "@/utils/storage";
import ReactPlayer from 'react-player'
import { Observer, useLocalObservable } from "mobx-react-lite";
import Visible from "@/components/Visible";
import { FullWidth, FullWidthFix, FullHeightFix, FullHeightAuto } from "../style";
import styled from "styled-components";

const VIDEO_STATUS = {
  CANPLAY: 'CANPLAY',
  PLAYING: 'PLAYING',
  BUFFERING: 'BUFFERING',
}


export const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin: 0 5px;
`;

export default function Player({
  resource = {},
  srcpath,
  type,
  looktime,
  onTimeUpdate,
}) {
  const store = useStore();
  const local = useLocalObservable(() => ({
    fullscreen: false,
    isMobile: true,
    volume: window.volume || parseInt(storage.getValue('volume')) || 30,
    muted: storage.getValue('muted') ? true : false,
    controls: false,
    playsinline: true,
    autoplay: false,
    playbackRate: 1,

    playing: false,
    player: null,
    status: VIDEO_STATUS.CANPLAY,
    duration: resource.size || 0,
    realtime: 0,
    buffertime: 0,
    dragtime: 0,
    displayPercent: 0,
    showControl: true,
    isDrag: false,
    error: '',
    // 恢复进度显示
    showRecover: false,
    bottomHeight: 0,
    // 手势显示：进度和声音改变
    showPeek: false,
    peekValue: '',
    takePeek(value) {
      this.peekValue = value;
      this.showPeek = true;
      clearTimeout(this.peekTimer);
      this.peekTimer = setTimeout(() => {
        this.showPeek = false;
      }, 1000);
    },
  }));
  return <Observer>{() => (
    <div style={local.fullscreen ? {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      zIndex: 9,
      display: 'flex',
      justifyContent: 'center',
      boxSizing: 'border-box',
      overflow: 'hidden',
    } : {
      position: 'relative',
      width: '100%',
      backgroundColor: 'black',
      zIndex: 9,
    }}>
      <div style={{
        position: 'relative',
        width: local.fullscreen ? 'calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right))' : '100%',
        height: local.fullscreen ? 'calc(100% - env(safe-area-inset-bottom))' : (local.isMobile ? 'auto' : 480),
        paddingTop: local.isMobile ? '56.25%' : 0,
        boxSizing: 'border-box',
        marginLeft: 'env(safe-area-inset-left)',
        marginRight: 'env(safe-area-inset-right)',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {local.showPeek && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '20%',
              transform: 'translate(-50%,-50%)',
              padding: '10px',
              borderRadius: 10,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
            }}
          >
            {local.peekValue}
          </div>
        )}
        <ReactPlayer
          style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, 0)', top: 0, zIndex: 2 }}
          url={srcpath}
          ref={ref => local.player = ref}
          loop={false}
          playing={local.playing}
          width={'100%'}
          height={'100%'}
          pip={true}
          controls={local.controls}
          playsinline={local.playsinline}
          playbackRate={local.playbackRate}
          wrapper={'div'}
          config={{
            file: {
              forceHLS: type === 'hls',
              // tracks: subtitles.map((s, i) => ({ kind: 'subtitles', src: store.app.baseURL + s.path, srcLang: s.lang, default: i === 0 })),
              attributes: {
                poster: 'http://192.168.0.124' + (resource.poster || resource.thumbnail || ''),
              }
            }
          }}
          onDuration={(duration) => {
            local.duration = duration
          }}
          onReady={(e) => {
            // console.log(e, 'onready')
            // local.duration = e.getDuration() || 0;
          }}
          onStart={(e) => {
            console.log(e, 'onstart')
            if (looktime) {
              local.showRecover = true;
              setTimeout(() => {
                local.showRecover = false;
              }, 4000)
            }
          }}
          onEnded={(e) => {
            // console.log(e, 'onended')
            local.status = VIDEO_STATUS.CANPLAY
          }}
          onError={(e) => {
            console.log(e.message, typeof e.message, 'onerror')
            local.error = e.message;
          }}
          onPlay={(e) => {
            console.log(e, 'onplay')
            local.playing = true;
            local.status = VIDEO_STATUS.PLAYING
            local.error = ''
          }}
          onPause={(e) => {
            console.log(e, 'onpause')
            local.playing = false
            local.status = VIDEO_STATUS.CANPLAY
          }}
          onBuffer={(e) => {
            local.status = VIDEO_STATUS.BUFFERING;
          }}
          onBufferEnd={(e) => {
            // console.log(e, 'onbufferend')
            if (local.playing) {
              local.status = VIDEO_STATUS.PLAYING
            } else {
              local.status = VIDEO_STATUS.CANPLAY
            }
          }}
          onProgress={(e) => {
            local.buffertime = e.loadedSeconds
            local.realtime = e.playedSeconds
            onTimeUpdate && onTimeUpdate(local.realtime)
          }}
          onSeek={(time) => {
            // console.log(time, 'onseeek', local.duration)
          }}
        />
        
      </div>
    </div>
  )}</Observer>
}
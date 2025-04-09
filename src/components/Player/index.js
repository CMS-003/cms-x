import { useCallback, useRef } from "react";
import ReactPlayer from 'react-player'
import { Observer, useLocalObservable } from "mobx-react-lite";
import { useGesture, useDrag } from '@use-gesture/react'
import Visible from "@/components/Visible";
import styled from "styled-components";
import { useRouter, useStore } from "@/contexts";
import Rcon from "@/components/Rcon/";
import { formatDuration, isPWAorMobile } from "@/utils";
import storage from "@/utils/storage";

import svgSuspended from '@/theme/icon/suspended-fill.svg'
import svgPlay from '@/theme/icon/play-fill.svg'
import svgQuit from '@/theme/icon/quit-fullscreen.svg'
import svgFull from '@/theme/icon/fullscreen.svg'
import svgLoading from '@/theme/icon/loading.svg'

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
const VPeek = styled.div`
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translate(-50%,-50%);
  padding: 10px;
  border-radius: 10;
  background-color: rgba(0,0,0,0.6);
  color: white;
`
const VBack = styled.div`
  position: absolute; 
  left: 0; 
  top: 0; 
  width: 100%; 
  height: 45px;
  line-height: 45px; 
  z-index: 12;
  background: linear-gradient(180deg,#00000080,#fdfdfd00);
`
const VGestrue = styled.div`
  z-index: 3;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
`
const VControl = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  z-index: 4;
  align-items: center;
  color: white;
  background: linear-gradient(0deg,#00000080,#fdfdfd00);
  padding: 5px;
  box-sizing: border-box;
`
export const ProgressWrap = styled.div`
display: flex;
flex-direction: column;
padding: 4px;
border-radius: 5px;
flex: 1;
position: relative;
margin: 0 10px 2px 10px;
`
export const Handler = styled.div`
width: 16px;
height: 10px;
border-radius: 20px;
position: absolute;
transform: translate(-8px,-4px);
background-color: #2bb7ff;
z-index: 11;
`
export const Tip = styled.span`
position: absolute;
left: 50%;
transform: translate(-50%, -30px);
background-color: #00000080;
border-radius: 5px;
padding: 3px 5px;
&::after {
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  content: '';
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 6px solid  #00000080;
}
`

const VRecover = styled.div`
  position: absolute;
  background-color: #0004;
  color: white;
  padding: 4px 5px;
  border-radius: 5;
  z-index: 12;
  left: 15;
`
const VError = styled.div`
  position: absolute;
  background-color: #0004;
  color: red;
  padding: 4px 5px;
  border-radius: 5;
  zIndex: 12;
  bottom: 20%;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
`

export default function Player({
  resource = {},
  video = {},
  type,
  looktime,
  onTimeUpdate,
}) {
  const store = useStore();
  const router = useRouter()
  const containerRef = useRef(null)
  const controlRef = useRef(null)
  const playerRef = useRef(null);
  const local = useLocalObservable(() => ({
    fullscreen: false,
    isMobile: isPWAorMobile(),
    volume: window.volume || parseInt(storage.getValue('volume')) || 30,
    muted: storage.getValue('muted') ? true : false,
    controls: false,
    playsinline: true,
    autoplay: false,
    playbackRate: 1,
    playing: false,
    seeking: false,
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
        local.setValue('showPeek', false)
      }, 1000);
    },
    setValue(key, value) {
      this[key] = value;
    }
  }));
  const seekTo = useCallback((time) => {
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.currentTime !== 'undefined') {
        internalPlayer.currentTime = time;
      } else {
        playerRef.current.seekTo(time);
      }
    }
  }, [])
  const bind = useDrag(({
    direction: [dx, dy],
    velocity: [vx, vy], // 修正：velocity 是数组 [vx, vy]
    movement: [mx, my],
    last,
    event
  }) => {
    event.preventDefault()
    if (last && (Math.abs(mx) > 3) || (Math.abs(my) > 3)) {
      const angle = Math.atan2(mx, my) * 180 / Math.PI
      if (angle >= -22.5 && angle < 22.5) console.log('下')
      else if (angle >= 67.5 && angle < 112.5) {
        console.log('右')
        seekTo(local.realtime + 10)
      }
      else if (angle >= 157.5 || angle < -157.5) console.log('上')
      else if (angle >= -112.5 && angle < -67.5) {
        console.log('左')
        seekTo(local.realtime - 10)
      }
    }
    if (last && mx === 0 && my === 0) {
      local.setValue('showControl', !local.showControl)
    }
  })
  return <Observer>{() => (
    <div
      ref={containerRef}
      style={local.fullscreen ? {
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
        <ReactPlayer
          style={{ position: 'absolute', left: '50%', transform: 'translate(-50%, 0)', top: 0, zIndex: 2 }}
          url={store.app.videoLine + video.path}
          ref={playerRef}
          loop={false}
          playing={local.playing}
          width={'100%'}
          height={'100%'}
          pip={true}
          controls={local.controls}
          playsinline={local.playsinline}
          playbackRate={local.playbackRate}
          muted={local.muted}
          wrapper={'div'}
          config={{
            file: {
              forceHLS: type === 'hls',
              // tracks: subtitles.map((s, i) => ({ kind: 'subtitles', src: store.app.baseURL + s.path, srcLang: s.lang, default: i === 0 })),
              attributes: {
                poster: store.app.imageLine + (resource.poster || resource.thumbnail || ''),
              }
            }
          }}
          onDuration={(duration) => {
            local.setValue('duration', duration)
          }}
          onReady={(e) => {
            // console.log(e, 'onready')
            // local.duration = e.getDuration() || 0;
            if (local.seeking) {
              local.setValue('seeking', false)
            }
          }}
          onStart={(e) => {
            console.log(e, 'onstart')
            if (looktime) {
              local.setValue('showRecover', true)
              setTimeout(() => {
                local.setValue('showRecover', false)
              }, 4000)
            }
          }}
          onEnded={(e) => {
            // console.log(e, 'onended')
            local.setValue('status', VIDEO_STATUS.CANPLAY)
          }}
          onError={(e) => {
            console.log(e.message, typeof e.message, 'onerror')
            local.setValue('error', e.message)
          }}
          onPlay={(e) => {
            console.log(e, 'onplay')
            local.setValue('playing', true)
            local.setValue('status', VIDEO_STATUS.PLAYING)
            local.setValue('error', '')
          }}
          onPause={(e) => {
            console.log(e, 'onpause')
            local.setValue('playing', false)
            local.setValue('status', VIDEO_STATUS.CANPLAY)
          }}
          onBuffer={(e) => {
            local.setValue('status', VIDEO_STATUS.BUFFERING)
          }}
          onBufferEnd={(e) => {
            // console.log(e, 'onbufferend')
            if (local.playing) {
              local.setValue('status', VIDEO_STATUS.PLAYING)
            } else {
              local.setValue('status', VIDEO_STATUS.CANPLAY)
            }
          }}
          onProgress={(e) => {
            local.setValue('buffertime', e.loadedSeconds)
            local.setValue('realtime', e.playedSeconds)
            onTimeUpdate && onTimeUpdate(local.realtime)
          }}
          onSeek={(time) => {
            console.log(time, 'onseeek', local.duration)
          }}
        />
        {local.showControl && (
          <VBack>
            <Rcon inline color='white' type="FaChevronLeft" onClick={() => {
              if (local.fullscreen) {
                local.setValue('fullscreen', false)
              } else {
                router.backView()
              }
            }} />
          </VBack>
        )}
        <Visible visible={!local.controls}>
          <VGestrue
            {...bind()}
          >
            {local.status === VIDEO_STATUS.BUFFERING && <Icon className='spin-slow' src={svgLoading} />}
          </VGestrue>
        </Visible>
        <Visible visible={local.showPeek}>
          <VPeek>
            {local.peekValue}
          </VPeek>
        </Visible>
        <Visible visible={local.showRecover}>
          <VRecover onClick={() => {
            seekTo(looktime);
            local.setValue('showRecover', false)
            local.setValue('showControl', false)
          }}>
            恢复到 {formatDuration(looktime)}
          </VRecover>
        </Visible>
        <Visible visible={local.error}>
          <VError>{local.error}</VError>
        </Visible>
        <Visible visible={local.showControl}>
          <VControl ref={controlRef}>
            {/* 播放中,已暂停,缓冲中 */}
            {local.playing
              ? <Icon
                style={{ width: 24, height: 24, margin: 0 }}
                onTouchEndCapture={(e) => {
                  e.stopPropagation();
                  if (local.status === VIDEO_STATUS.BUFFERING) {
                    return;
                  }
                  local.setValue('playing', false)
                  local.setValue('status', VIDEO_STATUS.CANPLAY)
                }}
                onClick={e => {
                  e.stopPropagation();
                  if (local.status === VIDEO_STATUS.BUFFERING) {
                    return;
                  }
                  local.setValue('playing', false)
                  local.setValue('status', VIDEO_STATUS.CANPLAY)
                }}
                src={svgSuspended}
              />
              : <Icon
                style={{ width: 24, height: 24, margin: 0 }}
                src={svgPlay}
                onTouchEndCapture={(e) => {
                  e.stopPropagation();
                  if (local.status === VIDEO_STATUS.BUFFERING) {
                    return;
                  }
                  local.setValue('playing', true)
                }}
                onClick={e => {
                  e.stopPropagation();
                  if (local.status === VIDEO_STATUS.BUFFERING) {
                    return;
                  }
                  local.setValue('playing', true)
                }}
              />}
            <ProgressWrap className='progress' onClickCapture={e => {
              e.stopPropagation();
              const parentRect = e.currentTarget.getBoundingClientRect();
              const offsetX = e.clientX - parentRect.left;
              const time = local.duration * (offsetX / e.currentTarget.offsetWidth)
              local.setValue('realtime', time)
              seekTo(time)
              local.setValue('seeking', true)
            }}>
              <div style={{ position: 'absolute', left: 0, top: 3, width: '100%', height: 4, backgroundColor: '#fff4' }}></div>
              <div style={{ position: 'absolute', left: 0, top: 3, width: (local.duration ? 100 * local.buffertime / local.duration : 0) + '%', zIndex: 9, height: 4, backgroundColor: '#eee' }}></div>
              <div style={{ position: 'absolute', left: 0, top: 3, width: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%', zIndex: 10, height: 4, backgroundColor: '#1196db' }}></div>

              <Handler
                style={{ left: local.isDrag ? local.displayPercent : (local.duration ? 100 * local.realtime / local.duration : 0) + '%' }}
                onTouchStartCapture={e => {
                  e.stopPropagation();
                  local.setValue('dragtime', local.realtime)
                  local.setValue('displayPercent', 100 * local.realtime / local.duration + '%')
                  local.setValue('isDrag', true)
                }}
                onTouchMove={e => {
                  const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                  let offsetX = e.touches[0].clientX - parentRect.left;
                  if (offsetX < 0) {
                    offsetX = 0;
                  }
                  if (offsetX > parentRect.width) {
                    offsetX = parentRect.width;
                  }
                  local.setValue('dragtime', Math.round(offsetX / parentRect.width * local.duration))
                  local.setValue('displayPercent', 100 * offsetX / parentRect.width + '%')
                }}
                onTouchEnd={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const time = local.dragtime
                  console.log(local.realtime, time)
                  seekTo(time);
                  local.setValue('seeking', true)
                  local.setValue('realtime', time)
                  local.setValue('isDrag', false)
                  local.setValue('displayPercent', 0)
                }}
              >
                {local.isDrag && <Tip>{formatDuration(local.dragtime)}</Tip>}
              </Handler>
            </ProgressWrap>
            <span>{formatDuration(local.realtime)}/{formatDuration(local.duration)}</span>
            <img src={local.fullscreen ? svgQuit : svgFull} alt="" style={{ width: 20, height: 20, margin: '0 5px' }} onClick={() => {
              local.setValue('fullscreen', !local.fullscreen)
            }} />
          </VControl>
        </Visible>
      </div>
    </div>
  )}</Observer>
}